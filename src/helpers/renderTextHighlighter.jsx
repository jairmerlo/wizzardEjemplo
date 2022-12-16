import Highlighter from 'react-highlight-words'

export const renderTextHighlighter = ({
  text,
  isHighlighted,
  highlightedText,
  color = '#ffc069',
}) =>
  isHighlighted ? (
    <Highlighter
      highlightStyle={{
        backgroundColor: color,
        padding: 0,
      }}
      searchWords={[highlightedText]}
      autoEscape
      textToHighlight={text ? text.toString() : ''}
    />
  ) : (
    text
  )
