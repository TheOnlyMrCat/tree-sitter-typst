module.exports = grammar({
  name: "typst",

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s+/,
  ],
  externals: $ => [
    $.raw_block_start,
    $.raw_block_end,
  ],
  word: $ => $.ident,
  inline: $ => [
    $._statement,
    $._expression,
  ],
  
  rules: {
    source_file: $ => $.content_inner,
    content_inner: $ => repeat1(choice(
      token(prec(-1, /[^\s#$`/]+/)),
      $.escape_sequence,
      $.special_punct,
      "/",
      seq('*', $.bold_content, '*'),
      seq('_', $.em_content, '_'),
      seq('$', $.math_content, '$'),
      $.inline_raw_content,
      $.block_raw_content,
      $.code_introducer,
      $.url,
      // These are placed here to make them reachable from source_file?
      // $.line_comment,
      // $.block_comment,
    )),
    escape_sequence: $ => token(seq(
      "\\",
      choice(
        /[^\su]/,
        /u\{[0-9a-fA-F]+\}/
      )
    )),
    special_punct: $ => choice(
      "~",
      "\\",
      "---",
      "--",
      "...",
    ),
    // These two are wrong at the moment
    bold_content: $ => repeat1(/[^*]+/),
    em_content: $ => repeat1(/[^_]+/),
    inline_raw_content: $ => seq(
      '`',
      /[^`]+/,
      '`',
    ),
    block_raw_content: $ => seq(
      $.raw_block_start,
      optional(alias(token.immediate(prec(1, /\S+/)), $.raw_language)),
      alias(
        repeat(choice(/[^`]+/, /`+/)),
        $.raw_content_inner,
      ),
      $.raw_block_end,
    ),
    url: $ => /https?:\/\/.*/,

    math_content: $ => repeat1(choice(
      /[^a-zA-Z"&\\^_$]+/,
      $.symbol_name,
      $.math_function,
      /[a-zA-Z]/,
      $.code_introducer,
      $.escape_sequence,
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
      $.import_statement,
      $.include_statement,
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
      field("parameters", $.function_args),
    ),

    include_statement: $ => seq(
      field("keyword", "include"),
      field("object", $.string)
    ),

    import_statement: $ => seq(
      field("keyword", "import"),
      field("object", choice(
        $.ident,
        $.string,
      )),
      optional(seq(
        ":",
        choice(
          "*",
          seq(
            $.ident,
            repeat(seq(",", $.ident))
          )
        )
      ))
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
    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]+/,
        "\\",
        $.string_escape,
      )),
      '"',
    ),
    string_escape: $ => /\\("|u\{[0-9a-fA-F]+\})/,

    line_comment: $ => token(seq('//', /.*/)),
    block_comment: $ => seq(
      token(prec(1, '/*')),
      repeat(choice(
        $.block_comment,
        /[^*]/,
        /\*[^/]/,
      )),
      '*/'
    ),
  }
})
