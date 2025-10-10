import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type * as React from 'react';

export interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  orientation?: 'vertical' | 'horizontal';
}
