(code_introducer "#" @keyword.directive (let_statement))
(code_introducer "#" @keyword.directive (set_statement))
(code_introducer "#" @keyword.directive (import_statement))
(code_introducer "#" @keyword.directive (include_statement))
(code_introducer "#" @function (function_call))
(code_introducer "#" @string (string))
(let_statement keyword: "let" @keyword.directive)
(set_statement keyword: "set" @keyword.directive object: (ident) @function)
(import_statement keyword: "import" @keyword.directive)
(include_statement keyword: "include" @keyword.directive)
(function_call (ident) @function)
(math_function (symbol_name) @function)
(symbol_name) @variable.builtin

(special_punct) @punctuation.special
(math_special_punct) @punctuation.special

(bold_content) @markup.bold
(em_content) @markup.italic
(inline_raw_content) @markup.raw.inline
(block_raw_content) @markup.raw.block
(url) @markup.link.url

(escape_sequence) @constant.character.escape
(string_escape) @constant.character.escape

(string) @string
(number) @constant.numeric
(line_comment) @comment.line
(block_comment) @comment.block
