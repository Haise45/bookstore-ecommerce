import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../styles/dash.scss";

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "65%", flexShrink: 0 }}>
            <span className="pricetitle">Nguyễn Chung Hoàng</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Nhóm trưởng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Backend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography
            className="pricetitle"
            sx={{ width: "65%", flexShrink: 0 }}
          >
            <span className="pricetitle">Trần Thanh Phúc</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Backend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Backend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            className="pricetitle"
            sx={{ width: "65%", flexShrink: 0 }}
          >
            <span className="pricetitle">Nguyễn Văn Quốc Anh</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Backend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Backend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            className="pricetitle"
            sx={{ width: "65%", flexShrink: 0 }}
          >
            <span className="pricetitle">Trương Quang Hùng</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Backend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Backend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            className="pricetitle"
            sx={{ width: "65%", flexShrink: 0 }}
          >
            <span className="pricetitle">Phạm Nguyễn Hoàng Thế Nghĩa</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Frontend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Frontend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            className="pricetitle"
            sx={{ width: "65%", flexShrink: 0 }}
          >
            <span className="pricetitle">Nguyễn Lê Bảo Phước</span>
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>Frontend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Đảm nhận công việc:</Typography>
          <ul>
            <li>
              <Typography>• Use Case</Typography>
              <Typography>• Mô tả Use Case</Typography>
              <Typography>• Sơ đồ ECB</Typography>
              <Typography>• Sơ đồ tuần tự</Typography>
              <Typography>• Sơ đồ lớp</Typography>
              <Typography>• Thiết kế Frontend</Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
