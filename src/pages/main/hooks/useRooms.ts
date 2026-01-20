import { useEffect, useState } from 'react';
import { housemateAPI } from '../../../apis/housemate';
import { roomAPI } from '../../../apis/room';
import { FullThemeData } from '../../../constants/roomTheme';

const FOLLOWING_PAGE_SIZE = 30;

function mapThemeKeyToFullThemeKey(
  themeKey: string,
): keyof typeof FullThemeData {
  const themeMapping = {
    BASIC: 'FULL_BASIC',
    FOREST: 'FULL_FOREST',
    MARINE: 'FULL_MARINE',
  };

  return (themeMapping[themeKey as keyof typeof themeMapping] ||
    'FULL_BASIC') as keyof typeof FullThemeData;
}

async function fetchAllHousemates() {
  let page = 0;
  const all: Housemate[] = [];

  while (true) {
    const res = await housemateAPI.getFollowing(page, FOLLOWING_PAGE_SIZE);
    const mates = res?.housemates ?? [];

    all.push(...mates);

    if (mates.length < FOLLOWING_PAGE_SIZE) break;

    page += 1;
  }

  return all;
}

export default function useRooms(myUserId: number) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let myRoom = null;
        if (typeof myUserId === 'number') {
          const myRoomData = await roomAPI.getRoomById(myUserId);
          const myThemeKey = mapThemeKeyToFullThemeKey(myRoomData.theme);
          const myTheme = FullThemeData[myThemeKey] || FullThemeData.FULL_BASIC;
          myRoom = { ...myRoomData, modelPath: myTheme.modelPath };
        } else {
          console.warn('myUserId가 유효하지 않음:', myUserId);
        }

        const housemates = await fetchAllHousemates()

        const roomData = await Promise.all(
          housemates.map((mate: Housemate) =>
            roomAPI.getRoomById(mate.userId),
          ),
        );

        const modelRooms = roomData.map((room) => {
          const themeKey = mapThemeKeyToFullThemeKey(room.theme);
          const theme = FullThemeData[themeKey] || FullThemeData.FULL_BASIC;
          // // console.log('Room theme:', room.theme);
          return {
            ...room,
            modelPath: theme.modelPath,
          };
        });

        const allRooms = myRoom ? [myRoom, ...modelRooms] : modelRooms;
        setRooms(allRooms);
      } catch (error) {
        setError(error);
        console.error('방 정보 패치 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [myUserId]);

  return { rooms, loading, error };
}
