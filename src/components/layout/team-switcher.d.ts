import type * as React from 'react';

export type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export type TeamSwitcherProps = {
  teams: Team[];
};
