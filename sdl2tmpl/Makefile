prog_name = sdl2tmpl

build_run: build run

build:
	zig cc -std=c18 -Wall ./src/*.c -lSDL2 -o $(prog_name)

wasm:
	zig cc -std=c18 -Wall ./src/web/*.c -lSDL2 -o $(prog_name)

run:
	./sdl2tmpl $(prog_name)


cls:
	rm -f -- $(prog_name)

