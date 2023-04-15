

export default function (hljs) {

    const QUANTIFIERS = {
        className: 'regex-quantifier',
        begin: '[?*+]|{\\d+,?\\d*}',
        relevance: 0
    }

    const SET = {
        className: 'regex-set',
        begin: '\\\\[dDsSwW]',
        relevance: 0
    }

    const ESCAPE = {
        className: 'regex-escape',
        begin: '\\\\[\\s\\S]',
        relevance: 0
    }

    const ANCHOR = {
        className: 'regex-anchor',
        begin: "\\^|\\$|\\\\b|\\\\B",
        relevance: 0
    }

    const CHARACTER_CLASSES = {
        className: 'regex-class',
        begin: '\\[',
        end: '\\]',
        contains: [
            SET,
            ESCAPE,
        ]
    }

    return {
        name: 'Regular Expression',
        contains: [
            CHARACTER_CLASSES,
            {
                className: 'regex-grouping',
                begin: '\\(',
                end: '\\)',
                contains: [
                    {
                        begin: '\\(',
                        end: '\\)',
                        contains: ['self']
                    },
                    {
                        begin: '\\|',
                        relevance: 0
                    },
                    CHARACTER_CLASSES,
                    QUANTIFIERS,
                    ANCHOR,
                    SET,
                    ESCAPE,
                ]
            },
            QUANTIFIERS,
            ANCHOR,
            SET,
            ESCAPE,
            hljs.COMMENT(
                '(\\(\\?#)[^\\)]+\\)',
                null,
                {
                    relevance: 0
                }
            )
        ]
    }
}