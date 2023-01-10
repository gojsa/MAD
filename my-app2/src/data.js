export const methodOfPaymentSelect = {
  control: (base, state) => ({
    ...base,
    height: '24px',
    background: '#003E65',
    color: '#fff',
    width: 320,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0,
    borderRadius: 0,
    boxShadow: 'inset 0px 0px 10px rgba(0, 0, 0, 0.9)',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    width: 320,
    marginTop: 0,
    color: 'black',
    fontWeight: '600',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
}
