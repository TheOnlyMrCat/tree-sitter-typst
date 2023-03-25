# tree-sitter-typst

[Typst](https://github.com/typst/typst) grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

Currently in a very early stage. Most scripting elements are not implemented yet, and the syntax tree doesn't
necessarily reflect the true structure of the document.

Currently implemented syntax includes:
- Text: bold, italic, *inline* raw, links, escape sequences, and special characters
- Math: symbols, special characters, strings, functions
- Scripting: Simple `let` and `set` rules, function calls, numeric literals, comments.

Syntax that is still to be implemented includes:
- Most scripting functionality
- Lists
- Raw blocks

## Installation

### Neovim

Install [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter). If you're using a premade config, you
probably already have it installed.

#### Add the parser

Source: <https://github.com/nvim-treesitter/nvim-treesitter#adding-parsers>

Add the following lua code to your startup file:

```lua
local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
parser_config.typst = {
  install_info = {
    url = "https://github.com/TheOnlyMrCat/tree-sitter-typst",
    files = {"src/parser.c"},
    generate_requires_npm = false,
    requires_generate_from_grammar = false,
  },
  filetype = "typst",
}
```

After doing this, start `nvim` and run `:TSInstall typst`. You only need to do this once.

#### Add queries

Source: <https://github.com/nvim-treesitter/nvim-treesitter#highlight>

Copy the contents of [`queries/`](https://github.com/TheOnlyMrCat/tree-sitter-typst/tree/master/queries) into
`.config/nvim/queries/runscript`.

#### Add the filetype

Add the following lua code to your startup file:

```lua
vim.filetype.add({
  extension = {
    typ = "typst",
  },
})
```

Or the equivalent vimscript code.

#### Enable tree-sitter syntax highlighting

Source: <https://github.com/nvim-treesitter/nvim-treesitter#highlight>

*If you're using a premade config, this might already be enabled by default. Check your config's
documentation for more details*

Add the following lua code to your startup file:

```lua
require'nvim-treesitter.configs'.setup {
  highlight = {
    -- Replace this with `enable = true` to enable tree-sitter highlighting for all buffers
    enable = { "typst" },
    -- See source link for details on this option
    additional_vim_regex_highlighting = false,
  },
}
```

### Helix

Add the following to your `languages.toml` file (usually in `~/.config/helix`):

```toml
[[language]]
name = "typst"
scope = "source.typst"
injection-regex = "^typ(st)?$"
file-types = ["typ"]
roots = []
comment-token = "//"

[[grammar]]
name = "typst"
source = { git = "https://github.com/TheOnlyMrCat/tree-sitter-typst", rev = "e3e26aadc728b768bf4fb04df7735e6f700074ef" }
```

Replace the `rev = ` key with the hash of the latest commit (or tag, if you prefer) from this repository

Then copy the contents of [`queries/`](https://github.com/TheOnlyMrCat/tree-sitter-typst/tree/master/queries)
into `runtime/queries/typst/` (where `runtime` is the helix runtime directory; `$HOME/.config/helix/runtime` on Linux/Mac,
`%appdata%\helix\runtime` on Windows)

To find your runtime directory, check the first few lines of output of `hx --health`
