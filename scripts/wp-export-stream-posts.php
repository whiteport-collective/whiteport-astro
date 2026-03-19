<?php
/**
 * Whiteport Stream Post Export Script
 *
 * Drop this file in your WordPress root directory (next to wp-config.php).
 * Access via browser: https://whiteport.com/wp-export-stream-posts.php
 * Save the JSON output to scripts/stream-posts-export.json
 *
 * IMPORTANT: Delete this file from the server after export!
 *
 * Usage:
 *   ?format=json    (default) Full JSON export
 *   ?format=summary  Quick overview of what will be exported
 *   ?id=1234         Export a single post by ID
 */

// Bootstrap WordPress
define( 'ABSPATH', __DIR__ . '/' );
require_once ABSPATH . 'wp-load.php';

// Security: only allow logged-in administrators
if ( ! current_user_can( 'manage_options' ) ) {
    http_response_code( 403 );
    die( json_encode( [ 'error' => 'Administrator access required. Please log in to wp-admin first.' ] ) );
}

header( 'Content-Type: application/json; charset=utf-8' );

$format = isset( $_GET['format'] ) ? sanitize_text_field( $_GET['format'] ) : 'json';
$single_id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0;

// Get all stream categories
function export_get_categories() {
    $terms = get_terms( [
        'taxonomy'   => 'stream_category',
        'hide_empty' => false,
    ] );
    $result = [];
    foreach ( $terms as $term ) {
        $result[ $term->term_id ] = [
            'id'    => $term->term_id,
            'name'  => $term->name,
            'slug'  => $term->slug,
            'count' => $term->count,
        ];
    }
    return $result;
}

// Get all locations
function export_get_locations() {
    $terms = get_terms( [
        'taxonomy'   => 'wtp_location',
        'hide_empty' => false,
    ] );
    $result = [];
    foreach ( $terms as $term ) {
        $result[ $term->term_id ] = [
            'id'   => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }
    return $result;
}

// Get all mentions
function export_get_mentions() {
    $terms = get_terms( [
        'taxonomy'   => 'wtp_mention',
        'hide_empty' => false,
    ] );
    $result = [];
    foreach ( $terms as $term ) {
        $result[ $term->term_id ] = [
            'id'   => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }
    return $result;
}

// Export gallery data for a post
function export_get_gallery( $post_id ) {
    $gallery = get_field( 'wtp_gallery', $post_id );
    if ( empty( $gallery ) ) {
        return [];
    }

    $items = [];
    foreach ( $gallery as $index => $row ) {
        $media_file = $row['media_file'] ?? null;
        $poster     = $row['poster'] ?? null;
        $display    = $row['display'] ?? [];

        $item = [
            'index'   => $index,
            'display' => $display,
        ];

        if ( $media_file ) {
            $item['media'] = [
                'id'       => $media_file['ID'] ?? null,
                'url'      => $media_file['url'] ?? '',
                'filename' => $media_file['filename'] ?? '',
                'type'     => $media_file['type'] ?? '',
                'subtype'  => $media_file['subtype'] ?? '',
                'filesize' => $media_file['filesize'] ?? 0,
                'width'    => $media_file['width'] ?? null,
                'height'   => $media_file['height'] ?? null,
            ];

            // Check for Google Drive file ID
            $attachment_id = $media_file['ID'] ?? 0;
            if ( $attachment_id ) {
                $gd_file_id = get_post_meta( $attachment_id, '_igd_media_file_id', true );
                $gd_account = get_post_meta( $attachment_id, '_igd_media_account_id', true );
                $video_dims = get_post_meta( $attachment_id, '_wtp_media_dimensions', true );
                $video_thumb = get_post_meta( $attachment_id, '_wtp_media_thumbnail_url', true );

                if ( $gd_file_id ) {
                    $item['media']['gdrive_file_id']    = $gd_file_id;
                    $item['media']['gdrive_account_id'] = $gd_account;
                }
                if ( $video_dims ) {
                    $item['media']['video_dimensions'] = $video_dims;
                }
                if ( $video_thumb ) {
                    $item['media']['video_thumbnail'] = $video_thumb;
                }
            }
        }

        if ( $poster ) {
            $item['poster'] = [
                'id'  => $poster['ID'] ?? null,
                'url' => $poster['url'] ?? '',
            ];
            // Check for GD ID on poster too
            $poster_id = $poster['ID'] ?? 0;
            if ( $poster_id ) {
                $gd_file_id = get_post_meta( $poster_id, '_igd_media_file_id', true );
                if ( $gd_file_id ) {
                    $item['poster']['gdrive_file_id'] = $gd_file_id;
                }
            }
        }

        $items[] = $item;
    }
    return $items;
}

// Export social media posts (flexible content)
function export_get_social_posts( $post_id ) {
    $posts = get_field( 'wtp_posts', $post_id );
    if ( empty( $posts ) ) {
        return [];
    }

    $items = [];
    foreach ( $posts as $row ) {
        $platform = $row['acf_fc_layout'] ?? 'unknown';
        $item = [
            'platform'      => $platform,
            'post_text'     => $row['post_text'] ?? '',
            'first_comment' => $row['first_comment'] ?? '',
            'is_custom'     => $row['is_custom'] ?? false,
            'post_footer'   => $row['post_footer'] ?? '',
        ];

        // Resolve mention taxonomy terms
        $mentions = $row['mention'] ?? [];
        if ( ! empty( $mentions ) ) {
            $item['mentions'] = array_map( function( $term_id ) {
                $term = get_term( $term_id, 'wtp_mention' );
                return $term ? [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ] : null;
            }, (array) $mentions );
            $item['mentions'] = array_filter( $item['mentions'] );
        }

        // Resolve collaboration taxonomy terms
        $collabs = $row['collaboration'] ?? [];
        if ( ! empty( $collabs ) ) {
            $item['collaborations'] = array_map( function( $term_id ) {
                $term = get_term( $term_id, 'wtp_mention' );
                return $term ? [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ] : null;
            }, (array) $collabs );
            $item['collaborations'] = array_filter( $item['collaborations'] );
        }

        // Resolve location taxonomy terms
        $locations = $row['location'] ?? [];
        if ( ! empty( $locations ) ) {
            $item['locations'] = array_map( function( $term_id ) {
                $term = get_term( $term_id, 'wtp_location' );
                return $term ? [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ] : null;
            }, (array) $locations );
            $item['locations'] = array_filter( $item['locations'] );
        }

        $items[] = $item;
    }
    return $items;
}

// Export a single stream post
function export_stream_post( $post ) {
    $post_id = $post->ID;

    // Basic post data
    $data = [
        'id'            => $post_id,
        'title'         => get_the_title( $post_id ),
        'slug'          => $post->post_name,
        'date'          => $post->post_date,
        'date_gmt'      => $post->post_date_gmt,
        'modified'      => $post->post_modified,
        'status'        => $post->post_status,
        'author'        => get_the_author_meta( 'display_name', $post->post_author ),
        'content_html'  => apply_filters( 'the_content', $post->post_content ),
        'content_raw'   => $post->post_content,
        'excerpt'       => get_the_excerpt( $post_id ),
        'permalink'     => get_permalink( $post_id ),
    ];

    // Stream categories
    $categories = wp_get_post_terms( $post_id, 'stream_category' );
    $data['categories'] = array_map( function( $term ) {
        return [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ];
    }, $categories );

    // WP tags (if any)
    $tags = wp_get_post_tags( $post_id );
    $data['tags'] = array_map( function( $term ) {
        return [ 'id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug ];
    }, $tags );

    // ACF fields
    $data['gallery']          = export_get_gallery( $post_id );
    $data['social_posts']     = export_get_social_posts( $post_id );
    $data['hide_from_stream'] = (bool) get_field( 'hide_from_stream', $post_id );
    $data['creative_note']    = get_field( 'creative_note', $post_id ) ?: '';
    $data['gdrive_link']      = get_field( 'wtp_google_drive_link', $post_id ) ?: '';

    // Linked object
    $linked_object_id = get_field( 'wtp_linked_objects', $post_id );
    if ( $linked_object_id ) {
        $data['linked_object'] = [
            'id'   => $linked_object_id,
            'type' => get_post_type( $linked_object_id ) ?: 'term',
        ];
        // Get footer from linked object
        $footer = get_field( 'wtp_ssp_footer', $linked_object_id );
        if ( $footer ) {
            $data['linked_object']['footer'] = $footer;
        }
        $gd_link = get_field( 'wtp_google_drive_link', $linked_object_id );
        if ( $gd_link ) {
            $data['linked_object']['gdrive_link'] = $gd_link;
        }
    }

    // Featured image (WP native)
    $thumb_id = get_post_thumbnail_id( $post_id );
    if ( $thumb_id ) {
        $data['featured_image'] = [
            'id'  => $thumb_id,
            'url' => wp_get_attachment_url( $thumb_id ),
        ];
        $gd_file_id = get_post_meta( $thumb_id, '_igd_media_file_id', true );
        if ( $gd_file_id ) {
            $data['featured_image']['gdrive_file_id'] = $gd_file_id;
        }
    }

    // Social media account names
    $platforms = [ 'instagram', 'facebook', 'linkedin', 'tiktok', 'personal', 'youtube' ];
    $social_names = [];
    foreach ( $platforms as $p ) {
        $name = get_field( "wtp_{$p}_name", $post_id );
        if ( $name ) {
            $social_names[ $p ] = $name;
        }
    }
    if ( ! empty( $social_names ) ) {
        $data['social_names'] = $social_names;
    }

    return $data;
}

// Main export logic
if ( $format === 'summary' ) {
    $query = new WP_Query( [
        'post_type'      => 'stream_post',
        'posts_per_page' => -1,
        'post_status'    => [ 'publish', 'draft', 'future', 'pending' ],
    ] );

    echo json_encode( [
        'total_posts' => $query->found_posts,
        'statuses'    => array_count_values( wp_list_pluck( $query->posts, 'post_status' ) ),
        'categories'  => export_get_categories(),
        'locations'   => export_get_locations(),
        'mentions'    => export_get_mentions(),
        'message'     => 'Use ?format=json for full export',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    exit;
}

// Full export
if ( $single_id ) {
    $post = get_post( $single_id );
    if ( ! $post || $post->post_type !== 'stream_post' ) {
        http_response_code( 404 );
        die( json_encode( [ 'error' => "Stream post {$single_id} not found" ] ) );
    }
    echo json_encode( export_stream_post( $post ), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    exit;
}

// Export all
$query = new WP_Query( [
    'post_type'      => 'stream_post',
    'posts_per_page' => -1,
    'post_status'    => [ 'publish', 'draft', 'future', 'pending' ],
    'orderby'        => 'date',
    'order'          => 'DESC',
] );

$export = [
    'exported_at' => date( 'c' ),
    'total'       => $query->found_posts,
    'taxonomies'  => [
        'categories' => export_get_categories(),
        'locations'  => export_get_locations(),
        'mentions'   => export_get_mentions(),
    ],
    'posts'       => [],
];

foreach ( $query->posts as $post ) {
    $export['posts'][] = export_stream_post( $post );
}

echo json_encode( $export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
