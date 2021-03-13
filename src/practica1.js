
var MemoryGame = function(gs) {

	this.cards = [];
	this.message = "Juego Memoria Spectrum";
	this.currentFlipped = null;
	this.foundPairs = 0;
	this.canClick = true;

	this.initGame = function(){
		var i = 0;
		for(card in gs.maps){
			if(card != "back"){
				this.cards[i] = new MemoryGameCard(card);
				this.cards[i + 1] = new MemoryGameCard(card);
				i += 2;
			}
		}
		/* Shuffle with sort
		this.cards.sort(function(a, b){
			return Math.floor(Math.random() * 3) - 1;
		})
		*/

		// Shuffle with Fisher-Yates
		for(let i = this.cards.length - 1; i > 0; i--){
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this.cards[i];
			this.cards[i] = this.cards[j];
			this.cards[j] = temp;
		}
		this.loop();
	}

	this.draw = function(){
		gs.drawMessage(this.message);
		for(var i = 0; i < this.cards.length; i++){
			this.cards[i].draw(gs, i);
		}
	}

	this.loop = function(){
		var that = this;
		setInterval(function(){ that.draw() }, 16);
	}

	this.onClick = function(cardId){
		if(this.canClick){
			if(!this.cards[cardId].isFlipped && !this.cards[cardId].pairFound){
				this.cards[cardId].flip();
				if(this.currentFlipped == null){
					this.currentFlipped = cardId;
				}
				else{
					if(this.cards[cardId].compareTo(this.cards[this.currentFlipped].sprite)){
						this.cards[cardId].found();
						this.cards[this.currentFlipped].found();
						this.currentFlipped = null;
						this.foundPairs++;
						if(this.foundPairs < 8){
							this.message = "¡Pareja encontrada!";
						}
						else{
							this.message = "¡Has ganado!";
						}
					}
					else{
						this.message = "Inténtalo de nuevo";
						this.canClick = false;
						var that = this;
						setTimeout(function(){
							that.cards[cardId].flip();
							that.cards[that.currentFlipped].flip();
							that.currentFlipped = null;
							that.canClick = true;
						}, 1000);
					}
				}
			}
		}
	}

}

var MemoryGameCard = function(sprite){

	this.sprite = sprite;
	this.pairFound = false;
	this.isFlipped = false;

	this.flip = function(){
		this.isFlipped = this.isFlipped ? false : true;
	}

	this.found = function(){
		this.pairFound = true;
	}

	this.compareTo = function(otherCard){
		return otherCard == this.sprite;
	}

	this.draw = function(gs, pos){
		if(this.pairFound || this.isFlipped){
			gs.draw(this.sprite, pos);
		}
		else{
			gs.draw("back", pos);
		}
	}
}