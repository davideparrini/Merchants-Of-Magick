# Merchants-Of-Magick

Merchants-Of-Magick is a university project inspired by the board game "Merchants of Magick" designed by Clarence Simpson. It aims to recreate the gameplay experience of the board game in a digital format, allowing players to enjoy the strategic and immersive world of magical merchants.

## Game Description

In "Merchants of Magick", players take on the roles of merchants who compete to become the most renowned and successful merchants in the magical realm.

The game revolves around managing resources, making shrewd business decisions. As a merchant, you will:

- **Acquire Resources**: Explore the mystical realm to gather rare magical ingredients, artifacts, and knowledge. These resources are vital for crafting powerful magical items to sell.

- **Craft Magical Items**: Utilize your acquired resources and magical abilities to craft and enchant a wide variety of magical items, from potent potions and enchanted artifacts to mystical spell scrolls.

- **Manage Your Shop**: As a merchant, you will run your own shop, displaying and selling your magical wares. Set prices, attract customers, and provide exceptional service to maximize your profits.

- **Compete with Other Merchants**: Engage in strategic competition with other players. Compete for customers, negotiate deals, and sabotage your rivals to gain an advantage and secure your place as the top merchant.

- **Expand Your Influence**: Establish connections with powerful magical factions, forge alliances, and undertake quests to enhance your reputation and expand your influence in the magical realm.

## Test app demo

Go to  [merchants-of-magick.firebaseapp.com](https://merchants-of-magick.firebaseapp.com/)  sign up and play the single player mode!
The current version of Merchants-Of-Magick deployed does not include a multiplayer mode. I need to deploy the server somewhere for testing the multiplayer!

## Game Rules

In "Merchants of Magick," players have four dice with different values: d6, d8, d10, and d12. These dice represent attributes that can be upgraded throughout the game. Let's dive into the rules:


-**Dice Upgrades**

At the beginning of each round, the values on the dice may change. Players can click on the dice to reveal which attribute they can upgrade. During a round, you can use a maximum of two dice for your actions. However, if you wish to use additional dice, you can do so by using an extra dice. Each player starts the game with six extra dice.


-**Extra Dice Usage**

You can use your extra dice strategically to add more dice to your current round. For example, if you initially have two dice for the round (e.g., d6 and d8), but you want to use a d12 as well, you can spend one of your extra dice to include it in your current round. This allows you to use three dice instead of the usual two. Use your extra dice wisely to optimize your actions.


-**Potions and Dice Values**

You can change the values on the dice using potions. Potions can be obtained by Adveturer's order reward, Charm skills like "Glamor Potion Supplier" or gaining skills, for each skill gained you obtain 1 potion. Each potion allows you to increment or decrement the value of a specific dice. This enables you to customize your dice values to better suit your strategy and objectives.


-**Attributes**

   Materials:
    Steel: Upgraded using a d6 dice.
    Wood: Upgraded using a d6 or d8 dice.
    Leather: Upgraded using a d6, d8, or d10 dice.

   Magic Components:
    Elemental: Upgraded using a d8, d10, or d12 dice.
    Arcane: Upgraded using a d10 or d12 dice.
    Wild: Upgraded using a d12 dice.

-**Skill Acquisition**

To gain a skill, you need to possess all the necessary materials or magic components for that skill. For example, to acquire a crafting skill, you must have all the required materials (Steel, Wood, and Leather). Similarly, for magic research skills, you need the corresponding magic components (Elemental, Arcane, and Wild).


-**Attribute Upgrades**

You can use any available dice to upgrade an attribute. The specific dice values required for each attribute are as follows:

   Steel: Upgraded using a dice value equal to or less than the request (ᨈ).

   Wood: Upgraded using a dice value equal to or less than the request (ᨈ).

   Leather: Upgraded using a dice value equal to or greater than the request (ᨈ).

   Elemental: Upgraded using a dice value equal to or greater than the request (ᨆ).

   Arcane: Upgraded using a dice value equal to or greater than the request (ᨆ).

   Wild: Upgraded using a dice value equal to or greater than the request (ᨆ).

Any doubts? Press the Legend ('L') red circle button! It will be helpful!

-**Crafting Cards Order**

To fulfill an order, you must possess the necessary crafting and magic skills indicated on the order card. For example, let's say you have a card for the "Fiery Scroll of the Dragons." To successfully craft this order, you must possess the skills corresponding to "Fiery," "Scroll," and "Dragons." If you have all the required skills, you can craft the "Fiery Scroll of the Dragons" and complete the order. 
When you successfully complete an order, it is moved to the Shop

-**Card Slip Mechanism**

Single Player Mode

After each round, a slip of cards is passed in a leftward direction. Let's explore this mechanism in detail:

   At the end of each round, the slip of cards moves from right to left.
   The first card from the deck (black) ,replaces the rightmost card in your card collection.
   The rightmost card in your collection then shifts to the middle position.
   The card in the middle position moves to the leftmost position.
   Finally, the leftmost card is removed from the game and is no longer available for use.

Multiplayer Mode

 It's a bit different, there is no deck of cards and the slip of cards is passed in a leftward direction to another player
 So it's a recycle of cards between players. 

-**The Shop**

Located near the timer, the Shop button is where all completed order cards are stored. Once an order is successfully crafted, it will be moved to the Shop. Keep track of your completed orders and manage your shop effectively.

-**Adventurer Card and Quests**

The blue Adventurer card features three orders to complete. Each completed order grants a specific reward, as indicated on the card. Focus on fulfilling these orders to earn valuable rewards.

Additionally, there are two quests available in the game. Completing these quests will reward you with the specified amount of gold, as mentioned on the quests themselves.


-**End of Game and Gold Calculation**

The game concludes at the end of the last round. At this point, the game calculates the total gold you have earned throughout the game. Let's explore the gold calculation process:

   The calculation takes into account various factors, including your Shop, skills gold, Adventurer order, quests and skills bonus.
   The gold earned from your Shop is determined by the completed orders stored in the Shop. Each completed order contributes to your total gold.
   Skills gold refers to the gold value associated with the skills you have acquired during the game
   Adventurer order grants a specific gold reward as indicated on the card.
   Quests provide additional chances to gain gold. By successfully completing the quests, you can earn the gold rewards mentioned on the quests themselves.
   Skills bonus provided by charm skills.
