'use client';

import useSound from 'use-sound';

export function useSatisfyingSounds() {
  const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  const prefix = isGH ? '/alhambra-web' : '';

  // On utilise des sons système ou des assets que vous devrez ajouter dans public/sounds/
  // Pour l'instant on prépare les fonctions
  
  const [playClick] = useSound(`${prefix}/sounds/click.mp3`, { volume: 0.5 });
  const [playHover] = useSound(`${prefix}/sounds/hover.mp3`, { volume: 0.2 });
  const [playSuccess] = useSound(`${prefix}/sounds/success.mp3`, { volume: 0.4 });

  return {
    playClick,
    playHover,
    playSuccess
  };
}
