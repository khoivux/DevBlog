import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  FolderIcon,
  FlagIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const AdminSidebar = ({ setActiveTab, setPostStatus, setCommentStatus  }) => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card className="h-[650px] w-[18rem] p-4 shadow-xl left-18 top-6">
      <div className=" p-2 pl-10">
        <Typography variant="h5" color="blue-gray">
          Trang quản trị
        </Typography>
      </div>
      <List>
        {/* Quản lý bài viết */}
        <Accordion open={open === 1} icon={<ChevronDownIcon className={`h-4 w-4 ${open === 1 ? "rotate-180" : ""}`} />}>
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 gap-2 p-3">
              <ListItemPrefix>
                <ClipboardDocumentListIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal">Quản lý bài viết</Typography>
            </AccordionHeader>
          </ListItem>
          {open === 1 && (
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem onClick={() => { setActiveTab("posts"); setPostStatus("approved"); }}>
                  <ListItemPrefix><ChevronRightIcon className="h-3 w-5" /></ListItemPrefix>
                  Bài viết đã duyệt
                </ListItem>
                <ListItem onClick={() => { setActiveTab("posts"); setPostStatus("pending"); }}>
                  <ListItemPrefix><ChevronRightIcon className="h-3 w-5 mr-auto font-normal text-base" /></ListItemPrefix>
                  Bài viết chưa duyệt
                </ListItem>
                <ListItem onClick={() => { setActiveTab("posts"); setPostStatus("hide"); }}>
                  <ListItemPrefix><ChevronRightIcon className="h-3 w-5 mr-auto font-normal text-base" /></ListItemPrefix>
                  Bài viết ẩn
                </ListItem>
              </List>
            </AccordionBody>
          )}
        </Accordion>

        {/* Quản lý người dùng */}
        <ListItem className="text-base gap-2" onClick={() => setActiveTab("users")}>
          <ListItemPrefix><UserGroupIcon className="h-5 w-5 " /></ListItemPrefix>
          Quản lý người dùng
        </ListItem>

        {/* Quản lý chủ đề */}
        <ListItem  className="text-base gap-2" onClick={() => setActiveTab("categories")}>
          <ListItemPrefix><FolderIcon className="h-5 w-5" /></ListItemPrefix>
          Quản lý danh mục
        </ListItem>

        {/* Quản lý báo cáo */}
        <Accordion open={open === 2} icon={<ChevronDownIcon className={`h-4 w-4 ${open === 2 ? "rotate-180" : ""}`} />}>
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3 gap-2">
              <ListItemPrefix><FlagIcon className="h-5 w-5" /></ListItemPrefix>
              <Typography className="mr-auto font-normal text-base">Báo cáo vi phạm</Typography>
            </AccordionHeader>
          </ListItem>
          {open === 2 && (
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem onClick={() => { setActiveTab("reportPost"); setPostStatus("report"); }}>
                  <ListItemPrefix><ChevronRightIcon className="h-3 w-5" /></ListItemPrefix>
                  Báo cáo bài viết
                </ListItem>
                <ListItem onClick={() => { setActiveTab("reportComment"); setCommentStatus("report"); }}>
                  <ListItemPrefix><ChevronRightIcon className="h-3 w-5" /></ListItemPrefix>
                  Báo cáo bình luận
                </ListItem>
              </List>
            </AccordionBody>
          )}

        </Accordion>
      </List>
    </Card>
  );
};

export default AdminSidebar;
