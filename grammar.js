module.exports = grammar({
  name: "typst",

  word: $ => $.ident,
  
  rules: {
    source_file: $ => $.content_inner,
    content_inner: $ => repeat1(choice(
      /[^\\~\-.*_$#\]]+/,
      $.special_punct,
      "-",
      ".",
      "]",
      seq('*', $.bold_content, '*'),
      seq('_', $.em_content, '_'),
      seq('$', $.math_content, '$'),
      seq('#', $.statement),
    )),
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
      /[^a-zA-Z"&\\$]+/,
      $.symbol_name,
      /[a-zA-Z]/,
      $.math_special_punct,
      $.string,
    )),
    symbol_name: $ => /[a-zA-Z][a-zA-Z.]+/,
    math_special_punct: $ => choice(
      "&",
      "\\",
    ),

    statement: $ => choice(
      seq("let", $.ident, "=", $.expr),
      seq(field("set", "set"), $.ident, $.dictionary),
      $.expr,
    ),

    expr: $ => choice(
      $.array,
      $.dictionary,
      $.number,
      $.string,
      $.ident,
      $.content,
      prec(1, seq($.expr, $.function_args)),
      prec(1, seq($.expr, $.content)),
      prec.left(1, seq($.expr, ".", $.expr)),
      prec.left(1, seq($.expr, "+", $.expr)),
    ),
    array: $ => seq(
      "(",
      $.expr,
      repeat(seq(",", $.expr)),
      optional(","),
      ")",
    ),
    dictionary: $ => seq(
      "(",
      $.ident,
      ":",
      $.expr,
      repeat(seq(",", $.ident, ":", $.expr)),
      optional(","),
      ")",
    ),
    content: $ => seq(
      token(prec(1, "[")),
      $.content_inner,
      token(prec(1, "]")),
    ),
    function_args: $ => seq(
      token(prec(1, "(")),
      optional(seq(
        choice($.expr, seq($.ident, ":", $.expr)),
        repeat(seq(",", choice($.expr, seq($.ident, ":", $.expr)))),
        optional(","),
      )),
      ")",
    ),
    ident: $ => /[a-zA-Z_][a-zA-Z0-9_.-]*/,
    number: $ => /[0-9]+(\.[0-9]+)?(%|pt|mm|cm|in|em|fr|deg|rad)?/,
    string: $ => seq('"', /[^"]+/, '"'),
  }
})
