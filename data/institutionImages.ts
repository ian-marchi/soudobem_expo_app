import { ImageSourcePropType } from 'react-native';

// Metro exige require() estático com caminho literal.
const IMAGES: Record<string, ImageSourcePropType[]> = {
  associacao_presente_20260424050126: [
    require('../assets/instituicoes/associacao_presente/foto_1.png'),
    require('../assets/instituicoes/associacao_presente/foto_2.png'),
    require('../assets/instituicoes/associacao_presente/foto_3.png'),
  ],
  centro_feminino_de_longa_permanencia_20260422164959: [
    require('../assets/instituicoes/centro_feminino/foto_1.png'),
    require('../assets/instituicoes/centro_feminino/foto_2.png'),
  ],
  centro_paula_elizabete_20260429234309: [
    require('../assets/instituicoes/centro_paula/foto_1.png'),
    require('../assets/instituicoes/centro_paula/foto_2.jpg'),
  ],
  fundacao_sara_20260429235515: [
    require('../assets/instituicoes/fundacao_sara/foto_1.jpg'),
    require('../assets/instituicoes/fundacao_sara/foto_2.jpg'),
  ],
};

export function getInstitutionImages(idOrSlug: string): ImageSourcePropType[] {
  return IMAGES[idOrSlug] ?? [];
}

export function getInstitutionAvatar(idOrSlug: string): ImageSourcePropType | null {
  const imgs = IMAGES[idOrSlug];
  return imgs && imgs.length > 0 ? imgs[0] : null;
}

export const BRAND_COLORIDO = require('../assets/brand/SOUDOBEMCOLORIDO.png');
export const BRAND_AZUL = require('../assets/brand/SOUDOBEMAZUL.png');
