/**
 * BoldText — Renders a string with **bold** markers using inline Text spans.
 *
 * Extracted from InsightsScreen.tsx.
 */

import React from 'react';
import { Text } from 'react-native';
import { parseBold } from '../../utils/text-helpers';

export function BoldText({
  text,
  style,
  boldStyle,
}: {
  text: string;
  style: object;
  boldStyle: object;
}) {
  const segments = parseBold(text);
  return (
    <Text style={style}>
      {segments.map((seg, i) =>
        seg.bold ? (
          <Text key={i} style={boldStyle}>
            {seg.text}
          </Text>
        ) : (
          <Text key={i}>{seg.text}</Text>
        )
      )}
    </Text>
  );
}
