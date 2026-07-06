import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/course/CourseCard';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/States';
import { IconBell, IconChevronRight, IconFlame, IconMenuGrid, IconPlus, IconSearch, IconWarn } from '../components/icons';
import { useDrawer } from '../components/layout/drawerContext';
import { courseGradient } from '../theme/tokens';
import { fmtHour } from '../utils/format';
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel';

export function Dashboard() {
  const navigate = useNavigate();
  const { openDrawer } = useDrawer();
  const vm = useDashboardViewModel();

  return (
    <div className="container">
      {/* top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-circle pressable mobile-only" aria-label="Abrir menu" onClick={openDrawer}>
            <IconMenuGrid />
          </button>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 7, background: '#fff', borderRadius: 24,
              padding: '7px 14px 7px 11px', boxShadow: '0 4px 14px rgba(20,20,45,0.06)',
            }}
            title="Coeficiente de rendimento"
          >
            <IconFlame />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#16153a' }}>
              {vm.student ? vm.student.cr.toFixed(1) : '—'}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9a9aa4', letterSpacing: '0.02em', marginTop: 1 }}>
              CR
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-circle pressable" aria-label="Buscar" onClick={() => navigate('/app/busca')}>
            <IconSearch />
          </button>
          <button
            className="icon-circle pressable" aria-label="Notificações"
            onClick={() => navigate('/app/notificacoes')}
            style={{ position: 'relative' }}
          >
            <IconBell />
            {vm.hasUnread && (
              <span
                style={{
                  position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: '50%',
                  background: '#FF5A4D', border: '2px solid #16153a',
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* saudação */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 16, color: '#8e8e98', fontWeight: 500 }}>
          Olá, {vm.greetingName} 👋
        </div>
        <h1 style={{ margin: '2px 0 0', fontSize: 30, fontWeight: 800, color: '#16153a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Semestre {vm.student?.semester ?? '—'}
        </h1>
      </div>

      {vm.isLoading ? (
        <DashboardSkeleton />
      ) : vm.isError ? (
        <ErrorState onRetry={vm.retry} />
      ) : (
        <>
          <div className="grid-2" style={{ marginBottom: 14 }}>
            {/* cards de stat */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: '#16153a', borderRadius: 24, padding: '16px 18px', boxShadow: '0 10px 24px rgba(20,20,45,0.18)' }}>
                <div style={{ fontSize: 12, color: '#a6a6c8', fontWeight: 600, letterSpacing: '0.02em' }}>CR atual</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>
                  {vm.student?.cr.toFixed(1)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7CE0A0' }}>
                    ▲ {vm.student?.crDelta.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 11, color: '#8a8aac' }}>vs semestre anterior</span>
                </div>
              </div>
              <div className="card" style={{ flex: 1, borderRadius: 24, padding: '16px 18px' }}>
                <div style={{ fontSize: 12, color: '#9a9aa4', fontWeight: 600, letterSpacing: '0.02em' }}>CP atual</div>
                <div style={{ fontSize: 34, fontWeight: 800, color: '#16153a', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 4 }}>
                  {vm.student?.cp.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: '#9a9aa4', marginTop: 4 }}>
                  {vm.student?.creditsCompleted} / {vm.student?.creditsTotal} créditos
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* próxima aula */}
              {vm.next && (
                <div
                  className="card pressable-row"
                  role="button"
                  onClick={() => navigate(`/app/disciplina/${vm.next!.course.id}`)}
                  style={{ borderRadius: 24, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div
                    style={{
                      width: 52, height: 52, borderRadius: 18, background: courseGradient(vm.next.course.color),
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 'none',
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', opacity: 0.85 }}>AULA</span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      {fmtHour(vm.next.course.slots[vm.next.slotIndex].start)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9a9aa4', letterSpacing: '0.03em' }}>PRÓXIMA AULA</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {vm.next.course.code} · {vm.next.course.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#8e8e98', marginTop: 2 }}>
                      Sala {vm.next.course.slots[vm.next.slotIndex].room}
                      {vm.next.course.professor ? ` · Prof. ${vm.next.course.professor}` : ''}
                    </div>
                  </div>
                  <IconChevronRight />
                </div>
              )}

              {/* alerta */}
              {vm.alerts.length > 0 && (
                <div
                  className="pressable-row"
                  role="button"
                  onClick={() => navigate(`/app/disciplina/${vm.alerts[0].courseId}`)}
                  style={{
                    background: '#FFF4E8', border: '1px solid #FFE0BD', borderRadius: 20,
                    padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: '50%', background: '#FF8A3D',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                    }}
                  >
                    <IconWarn />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#A85A12', lineHeight: 1.25 }}>
                      {vm.alerts[0].text}
                    </div>
                    {vm.alerts.length > 1 && (
                      <div style={{ fontSize: 12, color: '#C58A4A', marginTop: 1 }}>
                        {vm.alerts.slice(1).map((a) => a.text).join(' · ')}
                      </div>
                    )}
                  </div>
                  <div style={{ background: '#FF8A3D', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '5px 11px', flex: 'none' }}>
                    {vm.alerts.length} {vm.alerts.length === 1 ? 'alerta' : 'alertas'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* minhas disciplinas */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 14px' }}>
            <span className="section-title">Minhas disciplinas</span>
            <span
              className="pressable-row" role="button"
              style={{ fontSize: 13, fontWeight: 600, color: '#FF8A3D' }}
              onClick={() => navigate('/app/grade')}
            >
              Ver grade
            </span>
          </div>

          {vm.courses.length === 0 ? (
            <div className="container-narrow">
              <EmptyState
                title="Nenhuma disciplina ainda"
                subtitle="Adicione as matérias que você está cursando para acompanhar notas e faltas."
                actionLabel="Adicionar disciplina"
                onAction={() => navigate('/app/disciplina/nova')}
              />
            </div>
          ) : (
            <>
              <div className="cards-scroll scrollarea">
                {vm.courses.map((c) => (
                  <CourseCard key={c.id} course={c} onClick={() => navigate(`/app/disciplina/${c.id}`)} />
                ))}
              </div>

              <div className="mobile-only" style={{ marginTop: 22 }}>
                <button className="btn-primary pressable" onClick={() => navigate('/app/disciplina/nova')}>
                  <IconPlus />
                  Adicionar disciplina
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
