import { useState, useCallback, useEffect, useRef } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import { uploadFile } from "../../service/uploadService.js";
import { editProfile } from "../../service/userService.js";
Modal.setAppElement("#root");

const EditProfile = ({ isOpen, onClose, user, onSave }) => {
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [username, setUsername] = useState(user?.username || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(user?.avatarUrl);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const objectUrlRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        objectUrlRef.current = URL.createObjectURL(file);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const cropped = await getCroppedImg(selectedImage, croppedAreaPixels, true);
      setCroppedImage(cropped);
      setAvatar(cropped);
      setSelectedImage(null);
      setIsCropping(false);
    } catch (error) {
      console.error("Lỗi cắt ảnh:", error);
    }
  };

  const handleSave = async () => {

    let uploadedImageUrl = null;

    if(croppedImage) {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      // Tạo File từ Blob
      const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

      // Upload file lên backend
      uploadedImageUrl = await uploadFile(file);
    }  
   
    try {
      const updatedUser = {
        firstname,
        lastname,
        phone,
        username,
        displayName,
        avatarUrl: uploadedImageUrl,
      };
      const respone = await editProfile(updatedUser);
      alert("Chỉnh sửa thành công!");    // Hiển thị thông báo thành công
      onSave(respone);
      onClose();
    } catch (error) {
        console.error("Lỗi đăng bài:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setCroppedImage(null);
      setAvatar(user?.avatarUrl || ""); // Đặt lại avatar về mặc định
    }
  }, [isOpen, user?.avatarUrl]);
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Chỉnh sửa hồ sơ" 
      className="bg-white p-6 rounded-xl shadow-lg w-[500px] h-[600px] border border-gray-300 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <h2 className="text-xl font-bold text-center mb-4">Chỉnh sửa hồ sơ</h2>

      <div className="flex flex-col items-center mb-2">
        <img src={croppedImage || avatar} alt="Avatar" className="w-36 h-36 rounded-full object-cover border" />
        <label className="mt-2 text-blue-500 cursor-pointer">
          Đổi ảnh
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Form fields */}
      <div className="space-y-3">
        {[{
          label: "Họ",
          value: firstname,
          onChange: setFirstname,
        }, {
          label: "Tên",
          value: lastname,
          onChange: setLastname,
        }, {
          label: "Tên đăng nhập",
          value: username,
          onChange: setUsername,
        }, {
          label: "Tên hiển thị",
          value: displayName,
          onChange: setDisplayName,
        }, {
          label: "Số điện thoại",
          value: phone,
          onChange: setPhone,
        }].map(({ label, value, onChange }, index) => (
          <div key={index} className="flex items-center gap-3">
            <label className="w-1/3 text-gray-600 text-sm">{label}</label>
            <input
              type="text"
              className="w-2/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Hủy</button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Lưu</button>
      </div>

      {isCropping && (
        <Modal isOpen={isCropping} onRequestClose={() => setIsCropping(false)}
          className="bg-white p-6 rounded-2xl shadow-lg w-[500px] h-[400px] flex flex-col"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h2 className="text-xl font-semibold text-center mb-3">Cắt ảnh</h2>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              cropShape="round"
              showGrid={false}
            />
          </div>
          <div className="flex justify-end gap-2 ">
            <button onClick={() => setIsCropping(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Hủy</button>
            <button onClick={handleCrop} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Cắt</button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default EditProfile;
