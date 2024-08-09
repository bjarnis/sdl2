#include <stdio.h>
#include <SDL2/SDL.h>
#include "constants.h"

/*
draw bezier path
draw normalized bezier(t=1 pixel movement)

follow path
import image and display in rect
load images into layers and display
import sprite
animate sprite


*/

int game_is_running = FALSE;
SDL_Window* window = NULL;
SDL_Renderer* renderer = NULL;

int last_frame_time = 0;
int fps_idx = 0;
int fps_sum = 0;
int fps_ticklist[FPS_MAXSAMPLES];
int target_x;
int target_y;

struct ball {
	float x;
	float y;
	float width;
	float height;
} ball;


int init_window(void){
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0){
		fprintf(stderr, "Error init SDL.\n");
		return FALSE;
	}

	window = SDL_CreateWindow(
			NULL, 
			SDL_WINDOWPOS_CENTERED,
			SDL_WINDOWPOS_CENTERED,
			WINDOW_WIDTH,
			WINDOW_HEIGHT,
			SDL_WINDOW_BORDERLESS
	);
	if (!window){
		fprintf(stderr, "error creating SDL window\n");
		return FALSE;
	}

	renderer = SDL_CreateRenderer(window, -1, 0);
	if (!renderer){
		fprintf(stderr, "Error creating SDL Renderer\n");
		return FALSE;
	}

	return TRUE;
}

void set_ball_target(int x, int y){
	target_x = x;
	target_y = y;
}


void setup(void){
	ball.x = 20;
	ball.y = 20;
	ball.width = 15;
	ball.height = 15;
}

void process_input(){
	SDL_Event event;
	SDL_PollEvent(&event);

	switch (event.type){
		case SDL_QUIT:
			game_is_running = FALSE;
			break;
		case SDL_KEYDOWN:
			if (event.key.keysym.sym == SDLK_ESCAPE){
				game_is_running = FALSE;
			}
			break;
		case SDL_MOUSEBUTTONDOWN:
			int x;
			int y;
			//Uint32 buttons = SDL_GetMouseState(&x, &y)
			SDL_GetMouseState(&x, &y);
			set_ball_target(x, y);
			break;
	}
}


void update(){

	//TODO use to implement FPS counter then display on screen
	//int time_to_wait = FRAME_TARGET_TIME - (SDL_GetTicks() - last_frame_time);
	
	//if(time_to_wait > 0 && time_to_wait <= FRAME_TARGET_TIME){
	//	SDL_Delay(time_to_wait);
	//}

	float delta_time = (SDL_GetTicks() - last_frame_time) / 1000.0f;
	

	last_frame_time = SDL_GetTicks();

	ball.x += 70 * delta_time;
	ball.y += 50 * delta_time;
}

void render(){
	SDL_SetRenderDrawColor(renderer, 18, 18, 18, 255);
	SDL_RenderClear(renderer);

	SDL_Rect ball_rect = {
		(int)ball.x, 
		(int)ball.y, 
		(int)ball.width, 
		(int)ball.height
	};

	SDL_SetRenderDrawColor(renderer, 155, 155, 155, 255);
	SDL_RenderFillRect(renderer, &ball_rect);

	SDL_RenderPresent(renderer);
}

void destroy_window(){
	SDL_DestroyRenderer(renderer);
	SDL_DestroyWindow(window);
	SDL_Quit();
}

int main(){
	game_is_running = init_window();

	setup();

	while(game_is_running){
		process_input();
		update();
		render();
	}

	destroy_window();

	return 0;
}
