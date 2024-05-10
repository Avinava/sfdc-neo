import * as React from "react";
import AuthContext from "./AuthContext";
import { BsFillLightningFill } from "react-icons/bs";
import { BiCodeCurly } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { MdRule } from "react-icons/md";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

class HomeCards extends React.Component {
  static contextType = AuthContext;
  state = {
    cards: [
      {
        title: "Apex Code",
        description:
          "Generate test classes assisted by the metadata api, add code comments, documentation & code review for your apex classes using OpenAI.",
        icon: <BiCodeCurly size={25} style={{ color: "#ff9800" }} />,
        link: "/apex-generator",
        linkText: "Go to Apex Generator",
      },
      // {
      //   title: "Flow Generator <sup>experimental</sup>",
      //   description:
      //     "Generate Flow test classes & documentations using OpenAI.",
      //   icon: <BsFillLightningFill size={25} style={{ color: "#ff9800" }} />,
      //   link: "/flow-generator",
      //   linkText: "Go to Flow Generator",
      // },
      // {
      //   title: "Email Template Generator <sup>experimental</sup>",
      //   description: "Better format email templates using OpenAI.",
      //   icon: <AiOutlineMail size={25} style={{ color: "#ff9800" }} />,
      //   link: "/email-generator",
      //   linkText: "Go to Email Template Generator",
      // },
      // {
      //   title: "Validation Rule <sup>experimental</sup>",
      //   description:
      //     "Generate description & documentation for your validation rules using OpenAI.",
      //   icon: <MdRule size={25} style={{ color: "#ff9800" }} />,
      //   link: "/validation-rule-generator",
      //   linkText: "Go to Validation Rule Generator",
      // },
    ],
  };

  render() {
    return (
      <React.Fragment>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {this.state.cards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle>{parse(card.title)}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Link to={card.link}>
                  <Button
                    style={{
                      backgroundColor: "#ff9800",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {card.linkText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default HomeCards;
