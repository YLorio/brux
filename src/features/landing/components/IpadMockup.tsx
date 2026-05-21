/** Mockup de laptop con la captura del panel de Brux. */
export default function IpadMockup() {
  return (
    <div className="laptop">
      <div className="laptop__lid">
        <img className="laptop__img" src="/landing/dashboard.jpg" alt="Panel de Brux" />
      </div>
      <div className="laptop__base">
        <span className="laptop__notch" />
      </div>
    </div>
  )
}
