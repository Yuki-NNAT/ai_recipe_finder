import { MoreHorizontal } from 'lucide-react';
import { Card, Avatar, Badge, IconButton, SearchInput } from '@/ui';
import { useState } from 'react';
import { formatDate } from '@/utils/format';

const ROLE_TONE = { admin: 'solid', editor: 'warning', user: 'neutral' };

/** Users management table with a client-side search filter. */
export default function UsersTable({ users = [] }) {
  const [q, setQ] = useState('');
  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Users</p>
          <p className="text-sm text-muted">{filtered.length} of {users.length} users</p>
        </div>
        <div className="w-full sm:w-64">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search users…" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-y border-primary-100/70 bg-primary-50/40 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-3 py-3 font-semibold">Role</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100/70">
            {filtered.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-primary-50/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.name} size="xs" />
                    <div>
                      <p className="font-medium text-ink">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={ROLE_TONE[u.role] ?? 'neutral'} size="sm" className="capitalize">
                    {u.role}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className={`h-2 w-2 rounded-full ${u.status === 'inactive' ? 'bg-muted' : 'bg-success'}`} />
                    <span className="capitalize text-muted">{u.status ?? 'active'}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-muted">{u.joinedAt ? formatDate(u.joinedAt) : '—'}</td>
                <td className="px-5 py-3 text-right">
                  <IconButton label="User actions" variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
