
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
export const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';