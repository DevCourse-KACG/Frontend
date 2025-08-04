import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { COLORS } from '@/constants/colors';

const menuItems = [
    { label: '정보', path: (clubId: string) => `/clubs/${clubId}` },
    { label: '멤버', path: (clubId: string) => `/clubs/${clubId}/members` },
    { label: '캘린더', path: (clubId: string) => `/clubs/${clubId}/calendar` },
    { label: '체크리스트', path: (clubId: string) => `/clubs/${clubId}/checkLists` },
];

const ClubInfoSideMenu: React.FC = () => {
    const params = useParams();
    const clubId = params.clubId as string;

    const router = useRouter();

    if (!clubId) return null;

    return (
        <nav
            style={{
                height: '100%'

            }}
        >
            <ul style={{
                listStyle: 'none',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderRadius: '12px',
                backgroundColor: COLORS.beige,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                height: '100%',
                overflowY: 'auto'

            }}>
                {menuItems.map((item) => (
                    <li key={item.label} style={{ width: '100%' }}>
                        <button
                            style={{
                                background: COLORS.white,
                                border: '1px solid transparent',
                                borderRadius: '8px',
                                color: '#222',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                textAlign: 'left',
                                padding: '12px 16px',
                                width: '100%',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                                fontWeight: '500',
                            }}
                            onClick={() => router.push(item.path(clubId))}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = COLORS.brown;
                                e.currentTarget.style.color = COLORS.white;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = COLORS.white;
                                e.currentTarget.style.color = '#222';
                            }}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default ClubInfoSideMenu;