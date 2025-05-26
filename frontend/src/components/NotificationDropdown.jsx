import { useState, useEffect, useRef } from "react";  // Thêm useRef
import { Link } from "react-router-dom";
import { getNotifications, markAsRead } from "../service/notificationService";
import { IoPersonAddOutline, IoChatbubbleOutline, IoHeartOutline, IoNotificationsOutline } from "react-icons/io5";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";
import moment from "moment";
import "moment/locale/vi";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null);  // Ref cho vùng dropdown

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(JSON.parse(storedUser)); 
    // console.log(user);  // Chỗ này console log user ngay sau setUser sẽ là null do state bất đồng bộ
  }, []);

  useEffect(() => {
    fetchNotifications();
  
    if (user && !stompClient) {
      console.log("User ID: ", user.id);
      const socket = new SockJS("http://localhost:8081/ws");
  
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("WebSocket connected");
          const userId = user.id;
          client.subscribe(`/user/${userId}/notification`, (message) => {
            const newNotification = JSON.parse(message.body);
            setNotifications((prev) => [newNotification, ...prev]);
          });
        },
        onStompError: (frame) => {
          console.error("STOMP Error", frame);
        },
      });
  
      client.activate();
      setStompClient(client);
    }
  
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [user, stompClient]);

  // Xử lý click ngoài dropdown để đóng
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(1, 100);
      setNotifications(response?.data?.data || []);
    } catch (error) {
      console.log("Lỗi khi tải thông báo:", error.message);
    }
  };

  const markAllAsRead = async () => {
    if(notifications.filter((noti) => !noti.isRead).length > 0) {
      try {
        await markAsRead();
        setNotifications((prev) => prev.map((noti) => ({ ...noti, isRead: true })));
      } catch (error) {
        console.log("Lỗi khi cập nhật thông báo:", error.message);
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "FOLLOW":
        return <IoPersonAddOutline className="text-gray-500" />;
      case "COMMENT":
        return <IoChatbubbleOutline className="text-gray-500" />;
      case "LIKE":
        return <IoHeartOutline className="text-gray-500" />;
      default:
        return <IoNotificationsOutline className="text-gray-500" />;
    }
  };

  return (
    <div className="z-50 relative">
      <button
        className="relative text-2xl p-2 rounded-full hover:bg-gray-200 transition duration-200"
        onClick={() => {
          markAllAsRead();
          setShowNotifications(!showNotifications);
        }}
      >
        <IoNotificationsOutline />
        {notifications.filter((noti) => !noti.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {notifications.filter((noti) => !noti.isRead).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          ref={dropdownRef}  // Gán ref cho dropdown container
          className="absolute top-full right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-2 bg-gray-100 border-b text-gray-700 font-semibold">
            Thông báo
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm text-center">Không có thông báo mới</p>
            ) : (
              notifications.map((noti) => (
                <Link
                  key={noti.id}
                  to={noti.redirectUrl}
                  className="cursor-pointer flex items-center gap-4 p-2 border-b bg-white
                          hover:bg-gray-100 hover:shadow-lg hover:-translate-y-1
                          transition duration-300 ease-in-out rounded-lg"
                  onClick={() => {
                    setShowNotifications(false); // Đóng dropdown khi click vào 1 thông báo
                  }}
                >
                  <div className="text-2xl">{getNotificationIcon(noti.type)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{noti.title}</p>
                    <p className="text-sm text-gray-600">{noti.message}</p>
                    <p className="text-xs text-gray-400">{moment(noti.createdTime).fromNow()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
