import { useEffect, useState, useCallback } from "react";
import { getCategories } from "../service/categoryService.js";
import { uploadFile } from "../service/uploadService.js";
import { createPost } from "../service/postService.js";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import { Description, Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
const Write = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
    const [isCropping, setIsCropping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories(1, 1000, "");
                setCategories(response.data.data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error.message);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/jpg", "image/img"];
            
            if (!validTypes.includes(file.type)) {
                alert("Chỉ được chọn ảnh định dạng JPG, JPEG hoặc PNG!");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedImage(reader.result);
                setIsCropping(true);
                setIsOpen(true);
            
            };
        }
    };

    const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const cropped = await getCroppedImg(selectedImage, croppedAreaPixels);
            setCroppedImage(cropped);
            setSelectedImage(null);
            setIsCropping(false);
            setIsOpen(false); // Đóng modal sau khi cắt xong
        } catch (error) {
            console.error("Lỗi cắt ảnh:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuyển từ Object URL sang Blob
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        // Tạo File từ Blob
        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

        // Upload file lên backend
        const uploadedImageUrl = await uploadFile(file);

        try {
            const postData = {
                title,
                description,
                content,
                categoryId,
                thumbnailUrl: uploadedImageUrl,
            };
            const post = await createPost(postData);
            alert("Bài viết đã được đăng thành công!");
            navigate(`/post/${post.id}`);
        } catch (error) {
            console.error("Lỗi đăng bài:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
    }, [isOpen]);
    return (
        <div className='h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-4'>
            <h1 className="text-cl font-light">Tạo bài viết mới</h1>
            <form className="flex flex-col gap-6 flex-1 mb-6" onSubmit={handleSubmit}>
                <label className="w-max p-2 shadow-custom rounded-xl text-lg text-gray-500 bg-white flex items-center gap-2 cursor-pointer">
                    <input type="file" accept=".jpeg, .img, .jpg" className="hidden" onChange={handleImageChange} />
                    <img src="https://res.cloudinary.com/drdjvonsx/image/upload/v1742441196/icon-image-512_i1imcd.png" alt="icon" className="w-6 h-6" />
                    Thêm ảnh bìa
                </label>

                {croppedImage && (
                    <div className="w-full flex justify-start">
                        <img src={croppedImage} alt="Ảnh đã crop" className="max-w-full max-h-64 object-contain rounded-xl shadow-custom" />
                    </div>
                )}

                <input className="text-4xl font-semibold bg-transparent outline-none" type="text" placeholder="Tiêu đề bài viết" 
                    value={title} onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                    <label className="text-lg font-medium pr-3">Chọn một chủ đề</label>
                    <select
                        name="catId"
                        className="p-2 rounded-xl font-semibold bg-white outline-none shadow-custom"
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))} // Chuyển thành số
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <textarea className="p-2 rounded-xl bg-white shadow-custom" name="desc" placeholder="Mô tả ngắn" 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                />

                <ReactQuill theme="snow" className="h-full min-h-[450px] flex-1 rounded-xl bg-white shadow-custom" 
                    value={content} onChange={setContent}
                />

                <button className="bg-blue-800 text-white font-medium rounded-xl mb-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    Đăng bài
                </button>
            </form>

            {/* MODAL CẮT ẢNH */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                {/* Container Modal */}
                <div className="bg-white p-6 rounded-2xl shadow-2xl w-[95%] md:w-[800px] lg:w-[800px] h-[80vh] flex flex-col border border-gray-200">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-3">
                        <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa ảnh</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
                            <XMarkIcon className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Thông tin hướng dẫn */}
                    <span className="text-sm text-gray-500 mb-3">Kéo để điều chỉnh vị trí ảnh, cuộn chuột để zoom.</span>

                    {/* Khu vực cắt ảnh */}
                    <div className="relative flex-1 w-full h-full bg-gray-100 rounded-lg shadow-inner overflow-hidden">
                        <Cropper
                            image={selectedImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={16 / 9}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    </div>

                    {/* Nút điều khiển */}
                    <div className="mt-4 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" onClick={() => setIsOpen(false)}>Hủy</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={handleCrop}>Áp dụng</button>
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default Write;
