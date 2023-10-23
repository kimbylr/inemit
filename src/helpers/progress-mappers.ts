const mapLegendToStage: Record<string | number, string> = {
  1: '◔_◔',
  2: '•_•',
  3: '◡‿◡',
  4: '◠‿◠',
};

export const getLegend = (stage: string | number) => mapLegendToStage[stage] ?? '';

export const getColor = (stage: string, type?: 'bg' | 'stroke') => {
  switch (stage) {
    case '1':
      return type === 'stroke' ? 'stroke-yellow-50' : 'bg-yellow-50';
    case '2':
      return type === 'stroke' ? 'stroke-secondary-50' : 'bg-secondary-50';
    case '3':
      return type === 'stroke' ? 'stroke-primary-100' : 'bg-primary-100';
    case '4':
      return type === 'stroke' ? 'stroke-primary-150' : 'bg-primary-150';
    default:
      return '';
  }
};
