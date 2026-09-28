/**
 * CIMs da gestão (Venerável e Vigilantes). Só eles publicam no feed, editam a secretaria e
 * mantêm o cadastro de irmãos. Uma lista só, para a regra não divergir entre telas.
 */
export const CIMS_GESTORES = ["1001", "1002", "1003"]

export const ehGestor = (cim?: string | number | null) =>
  cim !== null && cim !== undefined && CIMS_GESTORES.includes(String(cim))
