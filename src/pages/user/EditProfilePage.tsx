const EditProfilePage = () => {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8 text-black">Uredi profil</h1>
      
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-600 ml-1">Ime</label>
            <input 
              type="text" 
              defaultValue="Marko"
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-600 ml-1">Prezime</label>
            <input 
              type="text" 
              defaultValue="Marković"
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-neutral-600 ml-1">Email adresa</label>
          <input 
            type="email" 
            defaultValue="marko@example.com"
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-neutral-600 ml-1">Broj telefona</label>
          <input 
            type="tel" 
            placeholder="+381 6x xxx xxxx"
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Sačuvaj izmene
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage;