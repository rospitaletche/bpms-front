    function StyleGuidePage() {
      return (
        <div className="min-h-screen w-full bg-gray-900 p-8 text-white">
          <header className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight">Guía de Estilos</h1>
            <p className="mt-2 text-lg text-gray-400">
              Nuestro taller de componentes de UI. Aquí probamos y documentamos cada pieza visual.
            </p>
          </header>

          <main>
            {/* Aquí es donde añadiremos y probaremos nuestros componentes */}
            <h2 className="mb-4 text-3xl font-bold">Componentes</h2>
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
              <p className="text-gray-500">Aún no hay componentes. ¡Vamos a crear el primero!</p>
            </div>
          </main>
        </div>
      );
    }

    export default StyleGuidePage;