import * as React from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { CardHeader } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <Button {...other}>Cost/Coverage</Button>;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(0deg)",
  marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
}));


//this preview card is for the virtual health links that are already in the database, and when editing them
const PreviewVirtualHealthCard = React.forwardRef((props,ref) => {
  const { virthealthlink } =props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ minWidth: 345, marginBottom: 2, maxWidth:345 }} ref={ref} {...props}>
      {/* icon,title, subtitle */}
      <CardHeader
        avatar={
          <Avatar
            alt=""
            src={virthealthlink.logo_url}
            sx={virthealthlink.logo_url ? {bgcolor: "white"}:{ bgcolor: "#8EBBA7" }}
          />
        }
        title={<Typography variant="body" >{virthealthlink.name}</Typography>}
        subheader={virthealthlink.specialty}
        
      />
      {/* description */}
      {virthealthlink.description && (
        <CardContent>
          <Typography variant="body2" sx={{textAlign:'left',wordBreak: "break-word"}} >{virthealthlink.description}</Typography>
        </CardContent>
      )}
      <CardActions disableSpacing sx={{justifyContent:'space-between'}} >
       {/* cost/coverage button */}
        {virthealthlink.info_cost && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ ml: 0 }}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
        {/* lean more button, takes user to the link */}
         <Link mr={1} ml={0} pl={1} variant="button" underline="none" href={virthealthlink.link}>
          learn more
        </Link>
      </CardActions>
      {/* cost/coverage info expanded view */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" sx={{ mb: 1.5,textAlign:'left' }} >
            {virthealthlink.info_cost}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
})
export default PreviewVirtualHealthCard;
