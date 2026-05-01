import { useState, useEffect, useMemo } from 'react'
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { usersService } from '../../services/usersService'
import type { UserDTO } from '../../types/user'
import { Role } from '../../types/auth'

const PAGE_SIZE = 12

const ROLE_TABS = [
  { label: 'Customers', value: Role.Customer },
  { label: 'Employees', value: Role.Employee },
] as const

const UsersPage = () => {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const [roleTab, setRoleTab] = useState<Role>(Role.Customer)
  const [page, setPage] = useState(1)

  useEffect(() => {
    usersService.getAll()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = users.filter((u) => u.role === roleTab)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
      )
    }

    list = [...list].sort((a, b) => {
      const nameA = a.username.toLowerCase()
      const nameB = b.username.toLowerCase()
      return sort === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })

    return list
  }, [users, search, sort, roleTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1) }
  const handleSortChange = (v: 'asc' | 'desc') => { setSort(v); setPage(1) }
  const handleRoleChange = (v: Role) => { setRoleTab(v); setPage(1) }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Korisnici</h1>
          <span className="text-sm text-gray-400">{filtered.length} korisnika</span>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm placeholder:text-gray-400 outline-none focus:border-amber-400 transition-all"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
          className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 outline-none cursor-pointer"
        >
          <option value="asc">Naziv A-Z</option>
          <option value="desc">Naziv Z-A</option>
        </select>
      </div>

      {/* Role tab + Table */}
      <div className="bg-white border border-neutral-100 rounded-xl overflow-hidden">
        {/* Customers / Employees switch */}
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  Učitavanje...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                  Nema korisnika
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr key={user.userId} className="hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0">
                  <td className="px-6 py-4 font-semibold text-neutral-800">{user.username}</td>
                  <td className="px-6 py-4 text-neutral-600">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4 text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4 text-neutral-500">{user.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${p === page
                  ? 'bg-blue-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default UsersPage
