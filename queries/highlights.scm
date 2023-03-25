(code_introducer "#" @keyword.directive (let_statement))
(code_introducer "#" @keyword.directive (set_statement))
(code_introducer "#" @function (function_call))
(let_statement keyword: "let" @keyword.directive)
(set_statement keyword: "set" @keyword.directive object: (ident) @function)
(function_call (ident) @function)
(math_function (symbol_name) @function)
(symbol_name) @variable.builtin
(special_punct) @punctuation.special
(math_special_punct) @punctuation.special
(bold_content) @markup.bold
(em_content) @markup.italic
(string) @string
(number) @constant.numeric