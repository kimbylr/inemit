const mapLegendToStage: { [key: string]: string } = {
  1: '◔_◔',
  2: '•_•',
  3: '◡‿◡',
  4: '◠‿◠',
};

export const getLegend = (stage: string) => mapLegendToStage[stage] ?? '';

export const getColor = (colors: { [key: string]: string }, stage: string) => {
  switch (stage) {
    case '1':
      return colors.yellow[50];
    case '2':
      return colors.secondary[50];
    case '3':
      return colors.primary[100];
    case '4':
      return colors.primary[150];
    default:
      return null;
  }
};
