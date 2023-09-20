import { useEffect, useState } from "react"
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Box, Button, Divider } from "@mui/material"
import "./style.css"
import { CardList } from "./CardList"
import { useStripeCustom } from "../hooks/useStripeCustom"
import { useSubscriptions } from "../hooks/useSubscriptions"
export const CardForm = ({ price }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cards, setCards] = useState([])
  const [cardName, setCardName] = useState("")
  const [error, setError] = useState(null)
  const { saveTokenToPaymentMethod, getCards } = useStripeCustom()
  const { createSubscription } = useSubscriptions()
  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await getCards()
        console.log(response?.data)
        setCards(response?.data)
      } catch (error) {
        console.error("Error fetching cards:", error)
      }
    }
    fetchCards()
  }, [])
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    const cardElement = elements.getElement(CardNumberElement)
    const { token, error } = await stripe.createToken(cardElement, {
      name: cardName,
    })
    if (error) {
      setError(error.message)
    } else {
      // console.log(token)
      setCardName("")
      setError(null)
      cardElement.clear()
      elements.getElement(CardExpiryElement).clear()
      elements.getElement(CardCvcElement).clear()
      if (price === "") {
        await saveTokenToPaymentMethod({ token: token.id, name: cardName })
        return
      }
      await createSubscription({ price, token })
    }
  }
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "1px solid #000",
        boxShadow: 8,
        p: 4,
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 3,
        }}
      >
        <Button
          sx={{
            backgroundColor: "#88ABAF",
            color: "#000",
            paddingX: 3,
            "&:hover": { backgroundColor: "#869A9C" },
          }}
        >
          Card
        </Button>
      </Box>
      <Divider />
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderBottom: "2px solid #808080",
            marginBottom: 4,
          }}
        >
          <input
            type="text"
            placeholder="Cardholder Name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            style={{
              fontSize: "16px",
              paddingBottom: "5px",
              paddingTop: "5px",
              paddingLeft: 0,
              width: "97%",
              border: "none",
              color: "#3F3F3F",
              outline: "none",
              "&:focus": {
                border: "none",
              },
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            borderBottom: "2px solid #808080",
            paddingY: "5px",
            marginBottom: 4,
          }}
        >
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#616161",
                  "::placeholder": {
                    color: "#616161",
                  },
                },
                invalid: {
                  color: "#3F3F3F",
                },
              },
              placeholder: "Card number",
            }}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "47%",
              borderBottom: "2px solid #808080",
              paddingY: "5px",
              marginBottom: 4,
            }}
          >
            <CardExpiryElement
              options={{
                placeholder: "Expiration date (MM/YY)",
                style: {
                  base: {
                    fontSize: "15px",
                    color: "#616161",
                    "::placeholder": {
                      color: "#616161",
                    },
                  },
                  invalid: {
                    color: "#3F3F3F",
                  },
                },
              }}
            />
          </Box>
          <Box
            sx={{
              width: "47%",
              borderBottom: "2px solid #808080",
              paddingY: "5px",
              marginBottom: 4,
            }}
          >
            <CardCvcElement
              options={{
                placeholder: "CVV",
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#616161",
                    "::placeholder": {
                      color: "#616161",
                    },
                  },
                  invalid: {
                    color: "#3F3F3F",
                  },
                },
              }}
            />
          </Box>
        </Box>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#50914A",
            color: "#fff",
            "&:hover": { backgroundColor: "#50914A" },
          }}
        >
          Go to
        </Button>
        {error && <p>{error}</p>}
      </form>
    </Box>
  )
}
