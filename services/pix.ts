import { api, isLocalMode } from './api';
import { Instituicao } from '../data/localData';

export interface PixData {
  payload_pix: string;
  qr_png_base64?: string;
  valor: number;
  nome_recebedor: string;
  cidade_recebedor: string;
}

export const pixService = {
  async gerarPix(instituicao: Instituicao, valor: number): Promise<PixData> {
    if (!isLocalMode()) {
      try {
        const res = await api.post<PixData>('/pix/gerar', {
          chave_pix: instituicao.chave_pix,
          nome_recebedor: instituicao.nome_exibicao.substring(0, 25).toUpperCase(),
          cidade_recebedor: instituicao.cidade.substring(0, 15).toUpperCase(),
          valor,
        });
        return res;
      } catch {}
    }
    // Fallback: payload BR Code simplificado gerado no cliente
    const payload = gerarPayloadBRCode(instituicao, valor);
    return {
      payload_pix: payload,
      valor,
      nome_recebedor: instituicao.nome_exibicao.substring(0, 25).toUpperCase(),
      cidade_recebedor: instituicao.cidade.substring(0, 15).toUpperCase(),
    };
  },
};

function gerarPayloadBRCode(inst: Instituicao, valor: number): string {
  const chave = inst.chave_pix;
  const nome = inst.nome_exibicao.substring(0, 25).padEnd(0, ' ');
  const cidade = inst.cidade.substring(0, 15);
  const valorStr = valor.toFixed(2);
  const txid = 'SDB' + Date.now().toString().substring(6);

  const merchantAccountInfo =
    '0014BR.GOV.BCB.PIX' +
    '01' + padLen(chave) + chave;

  const payload =
    '000201' +
    '010212' +
    '26' + padLen(merchantAccountInfo) + merchantAccountInfo +
    '52040000' +
    '5303986' +
    '54' + padLen(valorStr) + valorStr +
    '5802BR' +
    '59' + padLen(nome) + nome +
    '60' + padLen(cidade) + cidade +
    '62' + padLen('05' + padLen(txid) + txid) + '05' + padLen(txid) + txid +
    '6304';

  const crc = calcCRC16(payload);
  return payload + crc;
}

function padLen(str: string): string {
  return String(str.length).padStart(2, '0');
}

function calcCRC16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
