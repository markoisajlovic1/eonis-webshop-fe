import { useState, useEffect } from 'react'
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi'
import { MdOutlineEdit } from 'react-icons/md'
import { IoTrashBinOutline } from 'react-icons/io5'
import { GrUserAdmin } from 'react-icons/gr'
import { usersService } from '../../services/usersService'
import EditUserDialog from '../../dialogs/EditUserDialog'
import { toast } from 'react-toastify'
import type { UserDTO, UserSort, UserSearchBy } from '../../types/user'
import { GiArmorDowngrade } from "react-icons/gi";

const PAGE_SIZE = 5

const ROLE_TABS = [
  { label: 'Customers', value: 1 },
  { label: 'Employees', value: 0 },
] as const

const SEARCH_BY_OPTIONS: { label: string; value: UserSearchBy }[] = [
  { label: 'Ime / Prezime', value: 0 },
  { label: 'Korisničko ime', value: 1 },
  { label: 'Email', value: 2 },
]

const SORT_OPTIONS: { label: string; value: UserSort }[] = [
  { label: 'Ime A-Z', value: 0 },
  { label: 'Ime Z-A', value: 1 },
  { label: 'Prezime A-Z', value: 2 },
  { label: 'Prezime Z-A', value: 3 },
  { label: 'Korisničko ime A-Z', value: 4 },
  { label: 'Korisničko ime Z-A', value: 5 },
  { label: 'Email A-Z', value: 6 },
  { label: 'Email Z-A', value: 7 },
]

const UsersPage = () => {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [term, setTerm] = useState('')
  const [searchBy, setSearchBy] = useState<UserSearchBy>(0)
  const [searchByOpen, setSearchByOpen] = useState(false)
  const [sort, setSort] = useState<UserSort>(0)
  const [roleTab, setRoleTab] = useState<0 | 1>(1)
  const [page, setPage] = useState(1)
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null)

  // cisto da se na delete i promote i demote usera retrigeruje useeffect
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    usersService.filter({
      role: roleTab,
      term: term.trim() || undefined,
      searchBy,
      sort,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then(result => {
        if (cancelled) return
        setUsers(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(Math.max(1, result.totalPages))
      })
      .catch(err => { if (!cancelled) console.error(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [roleTab, term, searchBy, sort, page, refreshKey])

  const handleRoleChange = (v: 0 | 1) => { setRoleTab(v); setPage(1) }
  const handleSortChange = (v: UserSort) => { setSort(v); setPage(1) }
  const handleTermChange = (v: string) => { setTerm(v); setPage(1) }
  const handleSearchByChange = (v: UserSearchBy) => { setSearchBy(v); setSearchByOpen(false); setPage(1) }

  const handleDelete = (userId: string) => {
    usersService.delete(userId)
      .then(() => {
        setUsers(prev => prev.filter(u => u.userId !== userId))
        setTotalCount(prev => prev - 1)
        toast.success('Korisnik obrisan')
        setRefreshKey(prev => prev + 1)
      })
      .catch(() => toast.error('Greška pri brisanju'))
  }

  const handleRoleToggle = (user: UserDTO) => {
    const isEmployee = user.role === 0
    const action = isEmployee
      ? usersService.demoteToUser(user.userId)
      : usersService.promoteToEmployee(user.userId)

    action
      .then(updated => {
        setUsers(prev => prev.filter(u => u.userId !== updated.userId))
        setTotalCount(prev => prev - 1)
        toast.success(isEmployee ? 'Korisnik degradiran na Customer' : 'Korisnik promovisan u Employee')
        setRefreshKey(prev => prev + 1)
      })
      .catch(() => toast.error('Greška pri promeni uloge'))
  }

  const handleSaved = (updated: UserDTO) => {
    setUsers(prev => prev.map(u => u.userId === updated.userId ? updated : u))
  }

  const searchByLabel = SEARCH_BY_OPTIONS.find(o => o.value === searchBy)?.label ?? ''

  return (
    <>
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Korisnici</h1>
          <span className="text-sm text-gray-400">{totalCount} korisnika</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-1 max-w-sm">
          <div className="relative">
            <button
              onClick={() => setSearchByOpen(o => !o)}
              className="flex items-center gap-1.5 h-full px-3 py-3 bg-white border border-r-0 border-neutral-200 rounded-l-lg text-xs text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer whitespace-nowrap outline-none"
            >
              {searchByLabel}
              <FiChevronDown size={12} className={`transition-transform ${searchByOpen ? 'rotate-180' : ''}`} />
            </button>
            {searchByOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-35">
                {SEARCH_BY_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    onClick={() => handleSearchByChange(o.value)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 transition-colors cursor-pointer
                      ${searchBy === o.value ? 'font-semibold text-neutral-800' : 'text-neutral-600'}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              value={term}
              onChange={e => handleTermChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-neutral-200 rounded-r-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        <select
          value={sort}
          onChange={e => handleSortChange(Number(e.target.value) as UserSort)}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-neutral-100 px-4 pt-3 gap-0.5 bg-neutral-50">
          {ROLE_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleRoleChange(value)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all cursor-pointer
                ${roleTab === value
                  ? 'bg-white border border-b-0 border-neutral-200 text-neutral-800'
                  : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-neutral-100">
              <th className="px-6 py-3.5">Korisničko ime</th>
              <th className="px-6 py-3.5">Ime i prezime</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Telefon</th>
              <th className="px-6 py-3.5 text-center">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Učitavanje...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Nema korisnika</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.userId} className="hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0">
                  <td className="px-6 py-4 font-semibold text-neutral-800">{user.username}</td>
                  <td className="px-6 py-4 text-neutral-600">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4 text-neutral-500">{user.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-neutral-400">
                      <button
                        onClick={() => setEditingUser(user)}
                        title="Uredi korisnika"
                        className="hover:text-black transition-colors cursor-pointer"
                      >
                        <MdOutlineEdit size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        title="Obriši korisnika"
                        className="hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <IoTrashBinOutline size={17} />
                      </button>
                      <button
                        onClick={() => handleRoleToggle(user)}
                        title={user.role === 0 ? 'Demote to Customer' : 'Promote to Employee'}
                        className="hover:text-amber-500 transition-colors cursor-pointer"
                      >
                        {user.role === 0 ? <GiArmorDowngrade size={16} /> : <GrUserAdmin size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page ? 'bg-blue-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>

    {editingUser && (
      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={handleSaved}
      />
    )}
    </>
  )
}

export default UsersPage
