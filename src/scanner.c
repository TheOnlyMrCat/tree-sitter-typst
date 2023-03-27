#include <tree_sitter/parser.h>

typedef enum {
    RAW_BLOCK_START,
    RAW_BLOCK_END
} TokenType;

typedef struct {
    uint32_t fence_length;
} State;

void *tree_sitter_typst_external_scanner_create() {
    State *state = malloc(sizeof(State));
    state->fence_length = 0;
    return state;
}

void tree_sitter_typst_external_scanner_destroy(void *payload) {
    State *state = (State *) payload;
    free(state);
}

unsigned tree_sitter_typst_external_scanner_serialize(void *payload, char *buffer) {
    State *state = (State *) payload;
    buffer[0] = state->fence_length & 0xff;
    buffer[1] = (state->fence_length >> 8) & 0xff;
    buffer[2] = (state->fence_length >> 16) & 0xff;
    buffer[3] = (state->fence_length >> 24) & 0xff;
    return 4;
}

void tree_sitter_typst_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
    State *state = (State *) payload;
    if (length >= 4) {
        state->fence_length = buffer[0] + (buffer[1] << 8) + (buffer[2] << 16) + (buffer[3] << 24);
    }
}

bool tree_sitter_typst_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    State *state = (State *) payload;
    if (valid_symbols[RAW_BLOCK_START]) {
        unsigned fence_length = 0;
        while (lexer->lookahead == '`') {
            lexer->advance(lexer, false);
            fence_length++;
        }

        if (fence_length >= 3) {
            state->fence_length = fence_length;
            lexer->result_symbol = RAW_BLOCK_START;
            return true;
        }
    }
    if (valid_symbols[RAW_BLOCK_END]) {
        unsigned fence_length = 0;
        while (lexer->lookahead == '`' && fence_length < state->fence_length) {
            lexer->advance(lexer, false);
            fence_length++;
        }

        if (fence_length == state->fence_length) {
            lexer->result_symbol = RAW_BLOCK_END;
            return true;
        }
    }
    return false;
}
