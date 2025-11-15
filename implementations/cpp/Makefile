# Makefile for MML Parser C++ Implementation
# Designed for embedded systems and cross-compilation

CC = gcc
CXX = g++
AR = ar

# Compilation flags for embedded systems
CFLAGS = -Wall -Wextra -Werror -std=c11 -Os -ffunction-sections -fdata-sections
CXXFLAGS = -Wall -Wextra -Werror -std=c++11 -Os -ffunction-sections -fdata-sections
LDFLAGS = -Wl,--gc-sections

# Target architecture (can be overridden)
ARCH = native

# Build directories
BUILD_DIR = build
LIB_DIR = $(BUILD_DIR)/lib
OBJ_DIR = $(BUILD_DIR)/obj
BIN_DIR = $(BUILD_DIR)/bin

# Source files
SRC_C = mml_parser.c
SRC_CPP = mml_parser.cpp example.cpp
HEADERS = mml_parser.h

# Object files
OBJ_C = $(SRC_C:%.c=$(OBJ_DIR)/%.o)
OBJ_CPP = $(SRC_CPP:%.cpp=$(OBJ_DIR)/%.o)

# Library
LIB_NAME = mml_parser
STATIC_LIB = $(LIB_DIR)/lib$(LIB_NAME).a

# Executables
EXAMPLE_BIN = $(BIN_DIR)/mml_example

# Default target
all: dirs $(STATIC_LIB) $(EXAMPLE_BIN)

# Create directories
dirs:
	mkdir -p $(BUILD_DIR) $(LIB_DIR) $(OBJ_DIR) $(BIN_DIR)

# Static library
$(STATIC_LIB): $(OBJ_C)
	$(AR) rcs $@ $^

# Example executable (C++ version)
$(EXAMPLE_BIN): $(OBJ_CPP) $(STATIC_LIB)
	$(CXX) $(LDFLAGS) $(OBJ_CPP) -L$(LIB_DIR) -l$(LIB_NAME) -o $@

# Object files
$(OBJ_DIR)/%.o: %.c $(HEADERS)
	$(CC) $(CFLAGS) -c $< -o $@

$(OBJ_DIR)/%.o: %.cpp $(HEADERS)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -rf $(BUILD_DIR)

# Clean all files including generated ones
distclean: clean
	rm -f *.o *.a *.exe mml_example

# Test compilation only
check: $(OBJ_C) $(OBJ_CPP)
	@echo "✅ Compilation réussie"

# Show build information
info:
	@echo "MML Parser C++ Build Information"
	@echo "================================="
	@echo "Compiler C: $(CC)"
	@echo "Compiler C++: $(CXX)"
	@echo "Architecture: $(ARCH)"
	@echo "CFLAGS: $(CFLAGS)"
	@echo "CXXFLAGS: $(CXXFLAGS)"
	@echo "Source files: $(SRC_C) $(SRC_CPP)"
	@echo "Library: $(STATIC_LIB)"
	@echo "Example: $(EXAMPLE_BIN)"

# Memory usage analysis
size: $(EXAMPLE_BIN)
	@echo "Memory usage analysis:"
	@size $(EXAMPLE_BIN)
	@echo ""
	@echo "Static library size:"
	@ls -lh $(STATIC_LIB)

# Cross-compilation for ARM Cortex-M
arm-none-eabi: CC = arm-none-eabi-gcc
arm-none-eabi: CXX = arm-none-eabi-g++
arm-none-eabi: CFLAGS += -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16
arm-none-eabi: CXXFLAGS += -mcpu=cortex-m4 -mthumb -mfloat-abi=hard -mfpu=fpv4-sp-d16
arm-none-eabi: LDFLAGS += -T linker_script.ld
arm-none-eabi: all

# Cross-compilation for AVR (Arduino)
avr: CC = avr-gcc
avr: CXX = avr-g++
avr: CFLAGS += -mmcu=atmega328p -DF_CPU=16000000UL
avr: CXXFLAGS += -mmcu=atmega328p -DF_CPU=16000000UL
avr: all

# Cross-compilation for ESP32
esp32: CC = xtensa-esp32-elf-gcc
esp32: CXX = xtensa-esp32-elf-g++
esp32: CFLAGS += -mlongcalls
esp32: CXXFLAGS += -mlongcalls
esp32: all

# Run example
run: $(EXAMPLE_BIN)
	./$(EXAMPLE_BIN)

# Debug build
debug: CFLAGS += -g -O0 -DDEBUG
debug: CXXFLAGS += -g -O0 -DDEBUG
debug: all

# Release build (default)
release: CFLAGS += -DNDEBUG
release: CXXFLAGS += -DNDEBUG
release: all

.PHONY: all dirs clean distclean check info size arm-none-eabi avr esp32 run debug release
