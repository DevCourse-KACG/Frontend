'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { getFriends, acceptFriend, rejectFriend, deleteFriend, addFriend } from '@/api/friend';
import { FriendDto, FriendStatus, FriendStatusMap } from '@/types/friend';
import { COLORS } from '@/constants/colors';

// 각 아코디언 패널의 열림/닫힘 상태를 관리
type AccordionState = {
  [key in FriendStatus]: boolean;
};

const AVATAR_COLORS = [
  '#FFB6B6', '#B6E2FF', '#B6FFB6', '#FFF5B6', '#D1B6FF', '#FFB6E2', '#B6FFD1'
];

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

function getAvatarColor(idx: number) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

const FriendsList: React.FC = () => {
  const [acceptedFriends, setAcceptedFriends] = useState<FriendDto[]>([]);
  const [sentFriends, setSentFriends] = useState<FriendDto[]>([]);
  const [receivedFriends, setReceivedFriends] = useState<FriendDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [accordionState, setAccordionState] = useState<AccordionState>({
    [FriendStatus.ACCEPTED]: true,
    [FriendStatus.SENT]: false,
    [FriendStatus.RECEIVED]: false,
    [FriendStatus.REJECTED]: false,
    [FriendStatus.ALL]: false,
  });

  const fetchFriendsData = async () => {
    try {
      const acceptedRes = await getFriends(FriendStatus.ACCEPTED);
      const sentRes = await getFriends(FriendStatus.SENT);
      const receivedRes = await getFriends(FriendStatus.RECEIVED);

      setAcceptedFriends(acceptedRes.data ?? []);
      setSentFriends(sentRes.data ?? []);
      setReceivedFriends(receivedRes.data ?? []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : '친구 목록을 불러오는 데 실패했습니다.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const handleToggleAccordion = (status: FriendStatus) => {
    setAccordionState(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const refreshFriendsList = () => {
    setIsLoading(true);
    fetchFriendsData();
  };

  const handleAcceptFriend = async (friendId: number) => {
    try {
      await acceptFriend(friendId);
      toast.success("친구가 수락되었습니다.");
      refreshFriendsList();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '친구 수락에 실패했습니다.');
    }
  };

  const handleRejectFriend = async (friendId: number) => {
    try {
      await rejectFriend(friendId);
      toast.success("친구가 거절되었습니다.");
      refreshFriendsList();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '친구 거절에 실패했습니다.');
    }
  };

  const handleDeleteFriend = async (friendId: number) => {
    try {
      await deleteFriend(friendId);
      toast.success("친구가 삭제되었습니다.");
      refreshFriendsList();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '친구 삭제에 실패했습니다.');
    }
  };

  const handleFriendAdd = async () => {
    if (!searchTerm) {
      toast.error("친구의 이메일을 입력해주세요.");
      return;
    }

    try {
      await addFriend(searchTerm);
      toast.success(`${searchTerm} 님에게 친구 요청을 보냈습니다.`);
      setSearchTerm('');
      refreshFriendsList();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '친구 요청에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  const renderFriendItem = (friend: FriendDto, status: FriendStatus, idx: number) => {
    if (typeof friend.friendId !== 'number') return null;
    const avatarColor = getAvatarColor(idx);
    return (
      <div
        key={friend.friendId}
        className="flex items-center p-3 bg-white rounded-xl border border-gray-200 mb-3 shadow-sm gap-4 min-w-0 transition-shadow"
      >
        {friend.friendProfileImageUrl ? (
          <div
            className="w-[54px] h-[54px] rounded-full border-2 shadow-[0_2px_8px_0_rgba(0,0,0,0.07)] bg-[#f3f3f3] flex items-center justify-center overflow-hidden"
            style={{
              borderColor: avatarColor,
            }}
          >
            <img
              src={friend.friendProfileImageUrl}
              alt={`${friend.friendNickname} 프로필`}
              className="w-full h-full object-cover rounded-full"
              style={{
                aspectRatio: "1 / 1",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div
            className={`w-[54px] h-[54px] rounded-full flex items-center justify-center font-bold text-lg text-white border-2 shadow-[0_2px_8px_0_rgba(0,0,0,0.07)] select-none`}
            style={{
              backgroundColor: avatarColor,
            }}
          >
            {getInitials(friend.friendNickname || '')}
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="m-0 text-[17px] font-bold text-gray-700 truncate max-w-[160px]">
              {friend.friendNickname}
            </h3>
          </div>
          <p className="mt-1 text-[13px] text-gray-400 truncate max-w-[280px]">
            자기소개자기소개자기소개자기소개자기소개자기소개자기소개자기소개
          </p>
        </div>
        <div className="flex gap-2.5">
          {status === FriendStatus.ACCEPTED && (
            <button
              onClick={() => handleDeleteFriend(friend.friendId!)}
              className="px-4 py-1.5 rounded-full text-white font-semibold text-[14px] min-w-[60px] h-9 bg-red-300 shadow transition hover:bg-red-600"
            >
              삭제
            </button>
          )}
          {status === FriendStatus.RECEIVED && (
            <>
              <button
                onClick={() => handleAcceptFriend(friend.friendId!)}
                className="px-4 py-1.5 rounded-full text-white font-semibold text-[14px] min-w-[60px] h-9 bg-green-400 shadow transition hover:bg-green-700"
              >
                수락
              </button>
              <button
                onClick={() => handleRejectFriend(friend.friendId!)}
                className="px-4 py-1.5 rounded-full text-white font-semibold text-[14px] min-w-[60px] h-9 bg-gray-400 shadow transition hover:bg-gray-500"
              >
                거절
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const filteredAcceptedFriends = acceptedFriends;
  const filteredSentFriends = sentFriends;
  const filteredReceivedFriends = receivedFriends;

  if (isLoading) {
    return (
      <div className="text-center py-12 text-[22px] text-gray-400 font-semibold tracking-wide min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#f8f8f8] to-[#e3f2fd]">
        <span role="img" aria-label="loading" className="text-[36px] mr-2.5">⏳</span>
        친구 목록을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-semibold text-[20px] min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#f8f8f8] to-[#e3f2fd]">
        <span role="img" aria-label="error" className="text-[32px] mr-2.5">😢</span>
        {error}
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#f8f8f8] to-[#e3f2fd] box-border flex flex-col items-center">
      <div className="w-[92vw] max-w-[900px] min-w-[380px] mx-auto py-10 pb-7 box-border flex flex-col items-center">
        {/* 타이틀 */}
        <div className="text-center mb-6">
          <span className="inline-block text-[1.35rem] font-extrabold text-[#222] tracking-wide px-3.5 pb-2 text-shadow">
            친구 목록
          </span>
        </div>

        {/* 검색과 친구추가 버튼 (수정) */}
        <div className="flex justify-end gap-2 mb-4 items-center w-full max-w-[540px]">
          <input
            type="text"
            placeholder="친구의 이메일을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-gray-300 text-[15px] text-gray-700 bg-white outline-none font-medium shadow-sm transition-colors h-9"
          />
          <button
            className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[15px] min-w-[90px] h-9 font-bold tracking-wide shadow transition hover:bg-blue-600"
            onClick={handleFriendAdd}
          >
            친구 요청 보내기
          </button>
        </div>

        {/* 아코디언: 친구인 목록 */}
        <AccordionPanel
          title={<>{FriendStatusMap[FriendStatus.ACCEPTED]}</>}
          count={filteredAcceptedFriends.length}
          isOpen={accordionState[FriendStatus.ACCEPTED]}
          onToggle={() => handleToggleAccordion(FriendStatus.ACCEPTED)}
        >
          {filteredAcceptedFriends.length > 0 ? (
            filteredAcceptedFriends.map((f, idx) => renderFriendItem(f, FriendStatus.ACCEPTED, idx))
          ) : (
            <p className="text-center text-gray-300 text-[14px] m-0 py-2.5">
              <span role="img" aria-label="no-friends">🫥</span> 친구가 없습니다.
            </p>
          )}
        </AccordionPanel>

        {/* 아코디언: 친구 요청 받은 목록 */}
        <AccordionPanel
          title={<>{FriendStatusMap[FriendStatus.RECEIVED]}</>}
          count={filteredReceivedFriends.length}
          isOpen={accordionState[FriendStatus.RECEIVED]}
          onToggle={() => handleToggleAccordion(FriendStatus.RECEIVED)}
        >
          {filteredReceivedFriends.length > 0 ? (
            filteredReceivedFriends.map((f, idx) => renderFriendItem(f, FriendStatus.RECEIVED, idx))
          ) : (
            <p className="text-center text-gray-300 text-[14px] m-0 py-2.5">
              <span role="img" aria-label="no-requests">😶‍🌫️</span> 받은 친구 요청이 없습니다.
            </p>
          )}
        </AccordionPanel>

        {/* 아코디언: 친구 요청한 목록 */}
        <AccordionPanel
          title={<>{FriendStatusMap[FriendStatus.SENT]}</>}
          count={filteredSentFriends.length}
          isOpen={accordionState[FriendStatus.SENT]}
          onToggle={() => handleToggleAccordion(FriendStatus.SENT)}
        >
          {filteredSentFriends.length > 0 ? (
            filteredSentFriends.map((f, idx) => renderFriendItem(f, FriendStatus.SENT, idx))
          ) : (
            <p className="text-center text-gray-300 text-[14px] m-0 py-2.5">
              <span role="img" aria-label="no-sent">🫠</span> 보낸 친구 요청이 없습니다.
            </p>
          )}
        </AccordionPanel>
      </div>
    </div>
  );
};

// 재사용 가능한 아코디언 패널 컴포넌트
interface AccordionPanelProps {
  title: React.ReactNode;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionPanel = ({ title, count, isOpen, onToggle, children }: AccordionPanelProps) => {
  return (
    <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm w-full max-w-[540px] transition-shadow">
      <div
        onClick={onToggle}
        className={`flex justify-between items-center px-4 py-2.5 cursor-pointer font-bold text-gray-700 text-[1.05rem] select-none transition-colors min-h-[36px] h-9 ${
          isOpen ? 'bg-gray-50 border-b border-gray-200' : 'bg-white'
        }`}
      >
        <span>
          {title}{' '}
          <span className="text-gray-400 font-semibold text-[14px]">({count})</span>
        </span>
        <span
          className={`text-[1.15em] font-bold ml-2 transition-colors ${
            isOpen ? 'text-blue-500' : 'text-gray-300'
          }`}
        >
          {isOpen ? '▲' : '▼'}
        </span>
      </div>
      {isOpen && <div className="px-4 pt-3 pb-2 bg-white">{children}</div>}
    </div>
  );
};

export default FriendsList;