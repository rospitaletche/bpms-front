import React, { useState, Fragment, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faCopy, faCheck, faCircleInfo, faPlus, 
  faIdCard, faFileSignature, faFileLines, faEnvelope, 
  faClock, faBan, faUserPen, faCheckDouble, faTimes
} from '@fortawesome/free-solid-svg-icons';

// --- TIPOS (Para robustez con TypeScript) ---
type Observation = {
  id: number;
  autor: string;
  fecha: string;
  texto: string;
  tipo: 'standard' | 'rejection' | 'system';
};

type VerificationData = {
    user: {
        fullName: string;
        ci: string;
    };
    gestionId: string;
    motivo: string;
    domicilios: {
        anterior: string;
        actual: string;
    };
    prestadores: {
        anterior: string;
        nuevo: string;
    };
    documentos: {
        id: number;
        name: string;
        icon: import('@fortawesome/fontawesome-svg-core').IconDefinition;
    }[];
    notificacion: {
        metodo: string;
        contacto: string;
    };
    observaciones: Observation[];
};


// --- DATA DE EJEMPLO (Simula lo que vendría de una API) ---
const initialData: VerificationData = {
  user: {
    fullName: 'Gabrielle Gomez Piñero',
    ci: '51998406',
  },
  gestionId: '22535',
  motivo: 'Cambio de domicilio',
  domicilios: {
    anterior: 'Montevideo / Montevideo',
    actual: 'Calle de las Flores 567\nCanelones, Ciudad de la Costa',
  },
  prestadores: {
    anterior: 'AEFMPM',
    nuevo: 'CANCEL',
  },
  documentos: [
    { id: 1, name: 'Cédula de Identidad (Frente)', icon: faIdCard },
    { id: 2, name: 'Cédula de Identidad (Dorso)', icon: faIdCard },
    { id: 3, name: 'Declaración Jurada', icon: faFileSignature },
    { id: 4, name: 'Nota de Solicitud', icon: faFileLines },
  ],
  notificacion: {
    metodo: 'Correo Electrónico',
    contacto: 'g.gomez@email.com',
  },
  observaciones: [
    { 
      id: 1, 
      autor: 'Ricardo Ospitaletche', 
      fecha: '07/09/2025', 
      texto: 'Se contacta al usuario para solicitar el comprobante xxx. Quedó de enviarlo por correo en el transcurso del día.',
      tipo: 'standard',
    },
  ]
};


// --- SUB-COMPONENTES DE UI ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-borde">
          <h2 className="text-lg font-bold text-texto-principal">{title}</h2>
          <button onClick={onClose} className="text-texto-secundario hover:text-texto-principal transition-colors">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-borde rounded-lg shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-borde bg-gray-50 flex justify-between items-center">
    <h2 className="text-base font-bold text-primary">{title}</h2>
    {action}
  </div>
);

const CardBody = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// --- COMPONENTES DE LA PÁGINA ---

const Summary = ({ user, gestionId }: { user: VerificationData['user'], gestionId: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.ci);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex items-center justify-between p-6 flex-wrap gap-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-borde text-texto-secundario flex items-center justify-center text-2xl">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-texto-principal">{user.fullName}</h1>
          <p className="text-texto-secundario flex items-center gap-2">
            <span>C.I.</span>
            <span className="font-semibold">{user.ci}</span>
            <FontAwesomeIcon 
              icon={copied ? faCheck : faCopy}
              className={`cursor-pointer transition-colors ${copied ? 'text-exito' : 'hover:text-primary'}`}
              onClick={handleCopy}
              title={copied ? '¡Copiado!' : 'Copiar'}
            />
          </p>
        </div>
      </div>
      <div className="text-right">
        <label className="text-xs text-texto-secundario uppercase tracking-wider">Nº GESTIÓN</label>
        <p className="text-2xl font-bold text-primary">{gestionId}</p>
      </div>
    </Card>
  );
};

const Reason = ({ motivo }: { motivo: string }) => (
  <Card className="border-l-4 border-alerta-borde">
    <CardBody className="flex items-center gap-4">
      <FontAwesomeIcon icon={faCircleInfo} className="text-2xl text-yellow-500" />
      <div>
        <span className="text-xs text-texto-secundario uppercase block mb-1 tracking-wider">Motivo de la Solicitud</span>
        <p className="text-base font-bold">{motivo}</p>
      </div>
    </CardBody>
  </Card>
);

const Comparison = ({ domicilios, prestadores }: { domicilios: any, prestadores: any }) => (
  <Card>
    <CardHeader title="Domicilios y Prestadores de Salud" />
    <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div>
        <h3 className="text-xs text-texto-secundario uppercase block mb-1 tracking-wider">Anterior</h3>
        <p className="font-bold whitespace-pre-line">{domicilios.anterior}</p>
      </div>
      <div>
        <h3 className="text-xs text-texto-secundario uppercase block mb-1 tracking-wider">Actual / Solicitado</h3>
        <p className="font-bold whitespace-pre-line">{domicilios.actual}</p>
      </div>
      <div>
        <h3 className="text-xs text-texto-secundario uppercase block mb-1 tracking-wider">Prestador Anterior</h3>
        <p className="font-bold">{prestadores.anterior}</p>
      </div>
      <div>
        <h3 className="text-xs text-texto-secundario uppercase block mb-1 tracking-wider">Prestador Nuevo</h3>
        <p className="font-bold">{prestadores.nuevo}</p>
      </div>
    </CardBody>
  </Card>
);

const DocumentList = ({ documentos, onAdd }: { documentos: VerificationData['documentos'], onAdd: () => void }) => (
  <Card>
    <CardHeader 
      title="Documentación Adjunta" 
      action={
        <button onClick={onAdd} className="text-primary text-xl hover:bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors" title="Agregar documento">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      }
    />
    <CardBody>
      <ul className="flex flex-col gap-3">
        {documentos.map(doc => (
          <li key={doc.id} className="flex items-center justify-between p-3 border border-borde rounded-md hover:bg-fondo">
            <div className="flex items-center gap-3 font-semibold text-sm">
              <FontAwesomeIcon icon={doc.icon} className="text-primary w-5 text-center" />
              <span>{doc.name}</span>
            </div>
            <button className="px-3 py-1 text-xs font-bold bg-transparent border border-borde rounded-md hover:bg-gray-100 transition-colors">
              Ver
            </button>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);

const ObservationFeed = ({ observations, onAdd }: { observations: Observation[], onAdd: () => void }) => {
  const getObservationStyles = (tipo: Observation['tipo']) => {
    switch (tipo) {
      case 'rejection': return { container: 'bg-peligro-fondo border-peligro', authorIcon: faBan, authorColor: 'text-peligro', authorText: '(Rechazo)' };
      case 'system': return { container: 'bg-exito-fondo border-exito', authorIcon: faCheckDouble, authorColor: 'text-exito', authorText: '(Automático)' };
      default: return { container: 'bg-gray-50', authorIcon: faUserPen, authorColor: 'text-texto-principal', authorText: '' };
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Observaciones"
        action={
          <button onClick={onAdd} className="text-primary text-xl hover:bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors" title="Agregar observación">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        }
      />
      {/* AUMENTAMOS un poco la altura máxima del feed */}
      <CardBody className="max-h-80 md:max-h-96 overflow-y-auto">
        <ul className="flex flex-col gap-4">
          {observations.length > 0 ? observations.map(obs => {
            const styles = getObservationStyles(obs.tipo);
            return (
              <li key={obs.id} className={`p-3 border rounded-lg ${styles.container}`}>
                <div className="flex justify-between items-center mb-2 text-xs">
                  <strong className={`flex items-center gap-2 font-bold ${styles.authorColor}`}>
                    <FontAwesomeIcon icon={styles.authorIcon} />
                    {obs.autor} {styles.authorText}
                  </strong>
                  <span className="text-texto-secundario">{obs.fecha}</span>
                </div>
                <p className="text-texto-principal text-sm leading-relaxed whitespace-pre-wrap">{obs.texto}</p>
              </li>
            );
          }) : <p className="text-texto-secundario text-sm text-center">No hay observaciones.</p>}
        </ul>
      </CardBody>
    </Card>
  );
};

const ActionPanel = ({ isWaiting, onApprove, onReject, onRequestInfo, onUploadProviderResponse }: { 
  isWaiting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
  onUploadProviderResponse: () => void;
}) => {
    const title = isWaiting ? "Acción de espera vista prestador" : "Acciones de Verificación";

    return (
      <Card>
          <CardHeader title={title} />
          <CardBody className="flex flex-col gap-3">
              {isWaiting ? (
                <>
                  <button 
                    onClick={onUploadProviderResponse}
                    className="w-full text-center py-2.5 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors text-sm"
                  >
                    Subir respuesta del prestador
                  </button>
                  <button className="w-full text-center py-2.5 px-4 bg-transparent border border-borde font-bold rounded-lg hover:bg-fondo transition-colors text-sm">
                    Cerrar
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onApprove} className="w-full text-center py-2.5 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors text-sm">
                    Aprobar y Continuar
                  </button>
                  <button onClick={onRequestInfo} className="w-full text-center py-2.5 px-4 bg-transparent border border-borde font-bold rounded-lg hover:bg-fondo transition-colors text-sm">
                      Pedir más Información
                  </button>
                  <button onClick={onReject} className="w-full text-center py-2.5 px-4 bg-transparent border border-borde text-peligro font-bold rounded-lg hover:bg-peligro-fondo transition-colors text-sm">
                      Rechazar Solicitud
                  </button>
                   <button className="w-full text-center py-2.5 px-4 bg-transparent border border-borde font-bold rounded-lg hover:bg-fondo transition-colors text-sm mt-2">
                      Cerrar
                  </button>
                </>
              )}
          </CardBody>
      </Card>
    );
};


const NotificationPanel = ({ notificacion }: { notificacion: VerificationData['notificacion'] }) => (
  <Card>
    <CardHeader title="Forma de Notificación" />
    <CardBody className="text-center">
      <p className="text-base font-bold flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={faEnvelope} className="text-texto-secundario" />
        {notificacion.metodo}
      </p>
      <span className="block text-texto-secundario text-sm mt-1">{notificacion.contacto}</span>
    </CardBody>
  </Card>
);


// --- PÁGINA PRINCIPAL ---
export default function VerificationPage() {
  const [data, setData] = useState(initialData);
  const [isWaiting, setIsWaiting] = useState(false);
  const [modal, setModal] = useState<'none' | 'addDoc' | 'addObservation' | 'reject' | 'requestInfo' | 'approve' | 'uploadProvider'>('none');
  
  // Estados para los modales
  const [observationText, setObservationText] = useState('');
  const [newDocType, setNewDocType] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [requestInfoSubject, setRequestInfoSubject] = useState('');
  const [requestInfoBody, setRequestInfoBody] = useState('');
  const [notificationDate, setNotificationDate] = useState('');

  // Subida de respuesta del prestador (PDF)
  const [providerPdf, setProviderPdf] = useState<File | null>(null);
  const isPdfFile = (file: File | null) => !!file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));

  const addObservation = (text: string, type: Observation['tipo']) => {
    if (!text.trim()) return;
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const newObservation: Observation = {
      id: Date.now(),
      autor: 'Ricardo Ospitaletche',
      fecha: today,
      texto: text,
      tipo: type,
    };
    setData(prev => ({...prev, observaciones: [newObservation, ...prev.observaciones]}));
  };

  const handleSaveObservation = () => {
    const observationType = modal === 'reject' ? 'rejection' : 'standard';
    addObservation(observationText, observationType);
    setObservationText('');
    setModal('none');
  };

  const handleAddDocument = () => {
    if (!newDocType || !newDocFile) return;

    const newDocument = {
      id: Date.now(),
      name: `${newDocType}: ${newDocFile.name}`,
      icon: faFileLines,
    };

    setData(prev => ({
      ...prev,
      documentos: [...prev.documentos, newDocument],
    }));

    setNewDocType('');
    setNewDocFile(null);
    setModal('none');
  };

  const calculateBusinessDays = (startDate: Date, days: number): Date => {
    let count = 0;
    const currentDate = new Date(startDate);
    while (count < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
    }
    return currentDate;
  };

  const handleOpenRequestInfoModal = () => {
    const subject = `Solicitud de Cambio de Prestador de Salud ${data.gestionId}`;
    const body = `Estimado/a ${data.user.fullName}:\n\nCon referencia a su solicitud, necesitamos que nos proporcione la siguiente información adicional:\n\n\n\nQuedamos a su disposición.\nSaludos cordiales.`;
    setRequestInfoSubject(subject);
    setRequestInfoBody(body);
    setModal('requestInfo');
  };
  
  const handleSendRequestInfo = () => {
    if (!requestInfoSubject.trim() || !requestInfoBody.trim()) return;

    // 1. Simular el envío del correo
    console.log("--- Correo a Enviar ---");
    console.log("Destinatario:", data.notificacion.contacto);
    console.log("Asunto:", requestInfoSubject);
    console.log("Cuerpo:", requestInfoBody);
    console.log("-----------------------");

    // 2. Agregar una observación
    addObservation(`Se solicitó más información al usuario por correo electrónico. Asunto: "${requestInfoSubject}"`, 'standard');
    
    // 3. Resetear y cerrar el modal
    setRequestInfoSubject('');
    setRequestInfoBody('');
    setModal('none');
  };

  const handleOpenApproveModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setNotificationDate(today);
    setModal('approve');
  };

  const handleConfirmApproval = () => {
    if (!notificationDate) return;
    
    // 1. Calcular plazo de vista
    const businessDaysToAdd = data.motivo === 'Cambio de domicilio' ? 3 : 10;
    const deadline = calculateBusinessDays(new Date(notificationDate), businessDaysToAdd);
    const formattedDeadline = deadline.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // 2. Registrar observaciones de sistema
    addObservation('Correo de vista enviado al prestador saliente.', 'system');
    addObservation('Correo notificando al usuario.', 'system');
    addObservation(`Plazo de vista hasta ${formattedDeadline}.`, 'system');
    
    // 3. Cambiar a estado de espera
    setIsWaiting(true);
    
    // 4. Cerrar modal
    setModal('none');
  };

  // --- Subir respuesta del prestador (PDF) ---
  const handleOpenUploadProviderModal = () => {
    setProviderPdf(null);
    setModal('uploadProvider');
  };

  const handleConfirmUploadProvider = () => {
    if (!isPdfFile(providerPdf)) return;

    // 1) "Guardar" el PDF como documento de la gestión
    const newDocument = {
      id: Date.now(),
      name: `Respuesta del prestador: ${providerPdf!.name}`,
      icon: faFileLines,
    };
    setData(prev => ({
      ...prev,
      documentos: [...prev.documentos, newDocument],
    }));

    // 2) Dejar constancia en Observaciones
    addObservation(`Se subió la respuesta del prestador: ${providerPdf!.name}`, 'system');

    // 3) Cerrar modal
    setProviderPdf(null);
    setModal('none');
  };

  return (
    <Fragment>
      <div className="bg-fondo min-h-screen p-6">
        <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
          
          <main className={`lg:col-span-2 flex flex-col gap-6 transition-opacity`}>
            {isWaiting && (
              <div className="p-4 bg-primary text-white rounded-lg text-center font-bold flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faClock} />
                <span>Estado: A espera de respuesta del prestador</span>
              </div>
            )}
            <Summary user={data.user} gestionId={data.gestionId} />
            <Reason motivo={data.motivo} />
            <Comparison domicilios={data.domicilios} prestadores={data.prestadores} />
            <DocumentList documentos={data.documentos} onAdd={() => setModal('addDoc')} />
          </main>

          <aside className="flex flex-col gap-6 sticky top-6">
            <ActionPanel 
              isWaiting={isWaiting}
              onApprove={handleOpenApproveModal}
              onReject={() => setModal('reject')}
              onRequestInfo={handleOpenRequestInfoModal}
              onUploadProviderResponse={handleOpenUploadProviderModal}
            />
            <NotificationPanel notificacion={data.notificacion} />
            <ObservationFeed observations={data.observaciones} onAdd={() => setModal('addObservation')} />
          </aside>
        </div>
      </div>

      {/* --- Modales --- */}
      <Modal isOpen={modal === 'addDoc'} onClose={() => setModal('none')} title="Agregar Documento">
        <div className="p-6 space-y-4">
            {/* Campo: Tipo de Documento */}
            <div className="flex flex-col gap-2">
              <label htmlFor="doc-type-select" className="text-sm font-semibold text-texto-secundario">Tipo de Documento</label>
              <select 
                id="doc-type-select"
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full p-2 border border-borde rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              >
                <option value="" disabled>Seleccione un tipo...</option>
                <option value="Genérico">Genérico</option>
                <option value="Nota probatoria">Nota probatoria</option>
                <option value="Documentos probatorios">Documentos probatorios</option>
              </select>
            </div>
            {/* Campo: Archivo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="doc-file-input" className="text-sm font-semibold text-texto-secundario">Archivo</label>
              <input 
                type="file" 
                id="doc-file-input"
                onChange={(e) => e.target.files && setNewDocFile(e.target.files[0])}
                className="w-full text-sm text-texto-secundario file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-bold bg-transparent border border-borde rounded-lg hover:bg-fondo">Cancelar</button>
            <button 
              onClick={handleAddDocument} 
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
              disabled={!newDocType || !newDocFile}
            >
              Agregar
            </button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'addObservation' || modal === 'reject'} onClose={() => setModal('none')} title={modal === 'reject' ? 'Motivo del Rechazo' : 'Agregar Observación'}>
        <div className="p-6">
          <textarea 
            className="w-full p-2 border border-borde rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" 
            rows={5} 
            placeholder="Escriba aquí..."
            value={observationText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setObservationText(e.target.value)}
          ></textarea>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-bold bg-transparent border border-borde rounded-lg hover:bg-fondo">Cancelar</button>
            <button onClick={handleSaveObservation} className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50" disabled={!observationText.trim()}>Guardar</button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'requestInfo'} onClose={() => setModal('none')} title="Solicitar más Información">
        <div className="p-6 space-y-4">
            {/* Asunto */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email-subject" className="text-sm font-semibold text-texto-secundario">Asunto</label>
                <input 
                    type="text" 
                    id="email-subject"
                    value={requestInfoSubject}
                    onChange={(e) => setRequestInfoSubject(e.target.value)}
                    className="w-full p-2 border border-borde rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
            </div>
            {/* Cuerpo del Mensaje */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email-body" className="text-sm font-semibold text-texto-secundario">Cuerpo del Mensaje</label>
                <textarea 
                    id="email-body"
                    value={requestInfoBody}
                    onChange={(e) => setRequestInfoBody(e.target.value)}
                    rows={8}
                    className="w-full p-2 border border-borde rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                ></textarea>
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-bold bg-transparent border border-borde rounded-lg hover:bg-fondo">Cancelar</button>
            <button 
              onClick={handleSendRequestInfo} 
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
              disabled={!requestInfoSubject.trim() || !requestInfoBody.trim()}
            >
              Enviar Correo
            </button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'approve'} onClose={() => setModal('none')} title="Confirmar Aprobación y Notificar">
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="notification-date" className="text-sm font-semibold text-texto-secundario">Fecha de Notificación</label>
                <input 
                    type="date" 
                    id="notification-date"
                    value={notificationDate}
                    onChange={(e) => setNotificationDate(e.target.value)}
                    className="w-full p-2 border border-borde rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
            </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
            <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-bold bg-transparent border border-borde rounded-lg hover:bg-fondo">Cancelar</button>
            <button 
              onClick={handleConfirmApproval} 
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
              disabled={!notificationDate}
            >
              Confirmar y Notificar
            </button>
        </div>
      </Modal>

      {/* Modal: Subir respuesta del prestador (PDF) */}
      <Modal isOpen={modal === 'uploadProvider'} onClose={() => setModal('none')} title="Subir respuesta del prestador (PDF)">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="provider-pdf" className="text-sm font-semibold text-texto-secundario">Archivo PDF</label>
            <input 
              id="provider-pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setProviderPdf(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-texto-secundario file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {providerPdf && !isPdfFile(providerPdf) && (
              <span className="text-xs text-peligro">El archivo debe ser un PDF.</span>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button onClick={() => setModal('none')} className="px-4 py-2 text-sm font-bold bg-transparent border border-borde rounded-lg hover:bg-fondo">Cancelar</button>
          <button 
            onClick={handleConfirmUploadProvider}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50"
            disabled={!isPdfFile(providerPdf)}
          >
            Subir PDF
          </button>
        </div>
      </Modal>

    </Fragment>
  );
}
