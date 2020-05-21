import Room from "./Room.ts";

/*
    Room Tracker keeps track of all the rooms on the server.
*/

export default abstract class RoomTracker {
    
    static roomsAllowedOnServer = 200;
    static roomScanId: number = 1;                      // Loops through the rooms, using this as a scan ID.
    static roomList: Array<Room> = new Array(RoomTracker.roomsAllowedOnServer + 1);
    
	static getAvailableRoom(): Room {
        
        // Loop from `roomScanId` to `roomsAllowedOnServer`.
		for(let nextId = RoomTracker.roomScanId; nextId <= RoomTracker.roomsAllowedOnServer; nextId++) {
            
            // Check if the room is active. If it isn't, return it's value:
            if(!RoomTracker.isRoomActive(nextId)) {
                RoomTracker.roomScanId = nextId + 1;
                return RoomTracker.roomList[nextId];
            }
        }
        
        // If we haven't found an available ID, it means roomScanId looped to the maximum amount.
        // Now we need to reset back to 1, so it will loop around again
		for(let nextId = 1; nextId < RoomTracker.roomScanId; nextId++) {
            
            // Check if the room is active. If it isn't, return it's value:
            if(!RoomTracker.isRoomActive(nextId)) {
                RoomTracker.roomScanId = nextId + 1;
                return RoomTracker.roomList[nextId];
            }
        }
        
        // If every room is somehow filled, return the default room.
        return RoomTracker.roomList[0];
	}
	
	static getRoom( roomId: number ): Room {
        return RoomTracker.roomList[roomId];
    }
    
    static isRoomActive( roomId: number ): boolean {
        return RoomTracker.roomList[roomId].isActive;
    }
}
