module.exports = grammar({
  name: "typst",

  word: $ => $.ident,
  inline: $ => [$._statement, $._expression],
  
  rules: {
    source_file: $ => $.content_inner,
    content_inner: $ => repeat1(prec(-1, choice(
      /[^\\~\-.*_$#\]]+/,
      $.special_punct,
      "-",
      ".",
      "]",
      seq('*', $.bold_content, '*'),
      seq('_', $.em_content, '_'),
      seq('$', $.math_content, '$'),
      $.code_introducer,
    ))),
    special_punct: $ => choice(
      "~",
      "\\",
      "---",
      "--",
      "...",
    ),
    bold_content: $ => repeat1(/[^*]+/),
    em_content: $ => repeat1(/[^_]+/),

    math_content: $ => repeat1(choice(
      /[^a-zA-Z"&\\^_$]+/,
      $.symbol_name,
      $.math_function,
      /[a-zA-Z]/,
      $.math_special_punct,
      $.string,
    )),
    symbol_name: $ => /[a-zA-Z][a-zA-Z.]+/,
    math_function: $ => prec(1, seq(
      $.symbol_name,
      token(prec(1, "(")),
      $.math_content,
      token(prec(1, ")")),
    )),
    math_special_punct: $ => choice(
      "&",
      "\\",
      "^",
      "_",
    ),

    code_introducer: $ => seq(
      '#',
      $._statement,
    ),
    _statement: $ => choice(
      $.let_statement,
      $.set_statement,
      $._expression,
    ),

    let_statement: $ => seq(
      field("keyword", "let"),
      field("object", $.ident),
      "=",
      field("value", $._expression),
    ),

    set_statement: $ => seq(
      field("keyword", "set"),
      field("object", $.ident),
      field("parameters", $.dictionary),
    ),

    _expression: $ => choice(
      $.array,
      $.dictionary,
      $.number,
      $.string,
      $.ident,
      $.content,
      $.function_call,
      $.access,
      $.addition,
    ),
    array: $ => seq(
      "(",
      $._expression,
      repeat(seq(",", $._expression)),
      optional(","),
      ")",
    ),
    dictionary: $ => seq(
      "(",
      $.dict_pair,
      repeat(seq(",", $.dict_pair)),
      optional(","),
      ")",
    ),
    dict_pair: $ => seq(
      field("key", $.ident),
      ":",
      field("value", $._expression),
    ),
    access: $ => prec.left(1, seq($._expression, ".", $._expression)),
    addition: $ => prec.left(1, seq($._expression, "+", $._expression)),
    content: $ => seq(
      token(prec(1, "[")),
      $.content_inner,
      token(prec(1, "]")),
    ),
    function_call: $ => prec(1, seq(
      $.ident,
      $.function_args,
    )),
    function_args: $ => choice(
      seq(
        token(prec(1, "(")),
        optional(seq(
          choice($._expression, $.dict_pair),
          repeat(seq(",", choice($._expression, $.dict_pair))),
          optional(","),
        )),
        ")",
        repeat($.content)
      ),
      repeat1($.content),
    ),

    ident: $ => /[a-zA-Z_][a-zA-Z0-9_-]*/,
    number: $ => /[0-9]+(\.[0-9]+)?(%|pt|mm|cm|in|em|fr|deg|rad)?/,
    string: $ => seq('"', /[^"]+/, '"'),
  }
})
