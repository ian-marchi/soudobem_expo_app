export interface Instituicao {
  id: string;
  slug: string;
  nome_corporativo: string;
  nome_exibicao: string;
  cidade: string;
  estado: string;
  categoria: string;
  descricao: string;
  chave_pix: string;
  tipo_chave_pix: string;
  imagem_instituicao: string;
  destaque: boolean;
  data_cadastro: string;
  video_youtube: string;
  tem_video: boolean;
  tem_fotos: boolean;
  num_fotos: number;
  endereco?: string;
  fotos?: string[];
  fotos_urls?: string[];
}

export const INSTITUICOES_LOCAL: Instituicao[] = [
  {
    id: 'associacao_presente_20260424050126',
    slug: 'associacao_presente_20260424050126',
    nome_corporativo: 'Associacao Presente',
    nome_exibicao: 'Associação Presente',
    cidade: 'Montes Claros',
    estado: 'MG',
    categoria: 'Saúde',
    descricao:
      'A Associação Presente de Apoio a Pacientes com Câncer - Padre Tiãozinho é uma organização não governamental, filantrópica, que tem como Missão "Promover assistência, cuidado e amparo a jovens, adultos e idosos carentes com câncer e atuar na prevenção e diagnóstico precoce da doença".',
    chave_pix: '3832134296',
    tipo_chave_pix: 'telefone',
    imagem_instituicao: '',
    destaque: true,
    data_cadastro: '2026-04-24',
    video_youtube: '',
    tem_video: false,
    tem_fotos: true,
    num_fotos: 3,
    endereco: 'Rua Maria Fernanda Freitas de Jesus Cordeiro, 242 Bairro Canelas, Montes Claros - MG',
    fotos: [],
  },
  {
    id: 'centro_feminino_de_longa_permanencia_20260422164959',
    slug: 'centro_feminino_de_longa_permanencia_20260422164959',
    nome_corporativo: 'Lar das Velhinhas',
    nome_exibicao: 'Lar das Velhinhas',
    cidade: 'Montes Claros',
    estado: 'MG',
    categoria: 'Assistência Social',
    descricao: 'Desde 1922, acolhendo com amor. O Lar das Velhinhas oferece moradia, cuidado e dignidade para idosas em situação de vulnerabilidade social.',
    chave_pix: '+5538997470742',
    tipo_chave_pix: 'telefone',
    imagem_instituicao: '',
    destaque: true,
    data_cadastro: '2026-04-22',
    video_youtube: '',
    tem_video: false,
    tem_fotos: true,
    num_fotos: 2,
    endereco: 'Rua Dom João Pimenta, 65 - Centro, Montes Claros 39400-003',
    fotos: [],
  },
  {
    id: 'centro_paula_elizabete_20260429234309',
    slug: 'centro_paula_elizabete_20260429234309',
    nome_corporativo: 'Centro Paula Elizabete',
    nome_exibicao: 'Centro Paula Elizabete',
    cidade: 'Montes Claros',
    estado: 'MG',
    categoria: 'Educação',
    descricao:
      'Oferece ações preventivas a crianças, adolescentes, jovens e suas famílias em regiões vulneráveis de Montes Claros, buscando proteger e promover o desenvolvimento integral em territórios de risco social.',
    chave_pix: 'ianmarchi55@gmail.com',
    tipo_chave_pix: 'email',
    imagem_instituicao: '',
    destaque: true,
    data_cadastro: '2026-04-29',
    video_youtube: '',
    tem_video: false,
    tem_fotos: true,
    num_fotos: 2,
    endereco: 'Rua Sagrada Família de Nazaré, 555 - Jaraguá, Montes Claros',
    fotos: [],
  },
  {
    id: 'fundacao_sara_20260429235515',
    slug: 'fundacao_sara_20260429235515',
    nome_corporativo: 'Fundação Sara',
    nome_exibicao: 'Fundação Sara',
    cidade: 'Montes Claros',
    estado: 'MG',
    categoria: 'Saúde',
    descricao:
      'A Fundação Sara nasceu da convivência com a dor e a esperança durante o tratamento de leucemia da pequena Sara em 1996/1997. Desde 1998, recebe e assiste crianças e adolescentes com câncer e seus acompanhantes em Montes Claros - MG.',
    chave_pix: 'ianmarchi55@gmail.com',
    tipo_chave_pix: 'email',
    imagem_instituicao: '',
    destaque: true,
    data_cadastro: '2026-04-29',
    video_youtube: 'https://youtu.be/T0REnHjhjw0',
    tem_video: true,
    tem_fotos: true,
    num_fotos: 2,
    fotos: [],
  },
];

export const CATEGORIAS = [
  'Assistência Social',
  'Saúde',
  'Educação',
  'Crianças',
  'Idosos',
  'Meio Ambiente',
  'Cultura',
  'Esporte',
  'Outros',
];
