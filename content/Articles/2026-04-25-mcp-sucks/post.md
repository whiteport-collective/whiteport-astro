MCP Servers Suck — And I Deleted All of Mine

Status: not approved, not posted to LinkedIn, not posted to Facebook, not posted to Instagram.
Article: to be written.
Image: to be added.


LinkedIn, Mårten personlig.

I deleted every MCP server I had installed.

Then I asked my agent to do the same job with a script. It worked better. It was faster. And it stopped burning tokens I wasn't even using.

Here's what happened, and the three prompts that fixed it.

First, what is an MCP?

MCP stands for Model Context Protocol. Anthropic released it in late 2024 as an open standard for connecting AI agents to external tools — databases, APIs, file systems, browsers. The idea was beautiful: one protocol, every tool, plug and play.

The reality is less beautiful.

Problem one. They're expensive before you've typed a word.

Every MCP server loads its full tool catalog into your conversation context at startup. Every tool. Every schema. Every description. Whether you use them or not.

I ran this prompt in my agent.

How many tokens did the MCP servers load into this conversation at startup? Break it down per server and per tool.

The answer. Twenty-seven thousand tokens. Just to sit there. Most of them tools I never call.

That's twenty-seven thousand tokens of your context window gone. And on paid plans, twenty-seven thousand tokens you paid for before writing a single prompt.

Problem two. Installation is a mess.

Config files in three places. JSON that breaks on a missing comma. Restart the whole Claude app to reload. And if one server fails to boot, you restart again, and you pay the token cost again on the next load.

Problem three. Most MCPs are just a wrapper around a CLI you already have.

This is the one that broke me. I was paying twenty-seven thousand tokens of context to call tools that were, underneath, curl and gh and psql.

So I stopped.

Here are the three prompts that replaced my MCPs.

Prompt one. Measure the damage.

Tell me how many tokens each MCP server loads into this conversation at startup. Break it down per server and per tool. Highlight tools I haven't called in the last ten sessions.

You'll be shocked. Mine was twenty-seven thousand. A friend's was sixty-one thousand.

Prompt two. Build the replacement.

Build a script that lets me use the named MCP without loading it into the conversation. The script should live in my repo, accept the same inputs the MCP tool does, and return results I can read. Pick the simplest runtime that works — bash, Node, or Python.

The agent writes the script. You run it as a normal command. No protocol. No context cost. One file you can read and edit.

Prompt three. Make it permanent.

Separate the tool calls out of my skill files and replace them with references to the scripts. When a skill needs a tool, it should call the script, not rebuild the logic inline every time I load the skill.

This is the unlock. Tools live as scripts. Skills reference scripts. Nothing reloads into context. Nothing charges you twice.

The result.

Faster boot. Leaner context. Tools I can actually read. No more "please restart Claude to reload the MCP."

MCP is a good idea. The implementation taxes you for tools you don't use.

Until that changes, scripts win.

Which MCP would you rip out first?

First comment. Hashtags. AI. Claude. MCP. AI agents. WDS. Link to the article on whiteport dot com, blog, MCP servers suck.


Instagram, at whiteport, with Mårten as collaborator.

I deleted every MCP server I had.

Twenty-seven thousand tokens gone — just from loading them. Tools I never even called.

Three prompts replaced them.

One. Ask your agent how many tokens your MCPs burn at startup.

Two. Tell it to build a script that does the same job, without the protocol.

Three. Move the tool calls out of your skill files and into scripts.

Faster. Leaner. Cheaper.

MCP is a good idea badly taxed. Scripts win.

Hashtags. AI. Claude. MCP. AI agents. WDS. AI engineering.


Facebook, Mårten personlig, Whiteport page repostar.

Same as LinkedIn.
