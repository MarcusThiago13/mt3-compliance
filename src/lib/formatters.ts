export const maskCNPJ = (value: string) => {
  let v = value.replace(/\D/g, '')
  if (v.length > 14) v = v.slice(0, 14)
  return v
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

export const maskCurrency = (value: string) => {
  const num = value.replace(/\D/g, '')
  if (!num) return ''
  return (parseInt(num) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const unmaskCurrency = (value: string) => {
  return parseFloat(value.replace(/\D/g, '')) / 100 || 0
}
