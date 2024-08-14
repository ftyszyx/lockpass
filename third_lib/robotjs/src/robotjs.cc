#define NAPI_VERSION 8
// v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 and all later versions
#include <napi.h>

#include <vector>
#include "mouse.h"
#include "deadbeef_rand.h"
#include "keypress.h"
#include "screen.h"
#include "screengrab.h"
#include "MMBitmap.h"
#include "snprintf.h"
#include "microsleep.h"
#include <list>
#include <iostream>

#if defined(USE_X11)
#include "xdisplay.h"
#endif

// Global delays.
int mouseDelay = 10;
int keyboardDelay = 10;
// tools
MMMouseButton getMouseButton(const Napi::CallbackInfo &info, int index)
{
	if (info.Length() >= index + 1 && info[index].IsString())
	{
		std::string str = info[index].As<Napi::String>().Utf8Value();
		if (str == "right")
		{
			return RIGHT_BUTTON;
		}
		else if (str == "middle")
		{
			return CENTER_BUTTON;
		}
	}
	return LEFT_BUTTON;
}

struct _ScreenPos
{
	int x;
	int y;
};
typedef struct _ScreenPos ScreenPos;

int CheckMouseButton(const char *const b, MMMouseButton *const button)
{
	if (!button)
		return -1;

	if (strcmp(b, "left") == 0)
	{
		*button = LEFT_BUTTON;
	}
	else if (strcmp(b, "right") == 0)
	{
		*button = RIGHT_BUTTON;
	}
	else if (strcmp(b, "middle") == 0)
	{
		*button = CENTER_BUTTON;
	}
	else
	{
		return -2;
	}

	return 0;
}

struct KeyNames
{
	const char *name;
	MMKeyCode key;
};

static KeyNames key_names[] =
	{
		{"backspace", K_BACKSPACE},
		{"delete", K_DELETE},
		{"enter", K_RETURN},
		{"tab", K_TAB},
		{"escape", K_ESCAPE},
		{"up", K_UP},
		{"down", K_DOWN},
		{"right", K_RIGHT},
		{"left", K_LEFT},
		{"home", K_HOME},
		{"end", K_END},
		{"pageup", K_PAGEUP},
		{"pagedown", K_PAGEDOWN},
		{"f1", K_F1},
		{"f2", K_F2},
		{"f3", K_F3},
		{"f4", K_F4},
		{"f5", K_F5},
		{"f6", K_F6},
		{"f7", K_F7},
		{"f8", K_F8},
		{"f9", K_F9},
		{"f10", K_F10},
		{"f11", K_F11},
		{"f12", K_F12},
		{"f13", K_F13},
		{"f14", K_F14},
		{"f15", K_F15},
		{"f16", K_F16},
		{"f17", K_F17},
		{"f18", K_F18},
		{"f19", K_F19},
		{"f20", K_F20},
		{"f21", K_F21},
		{"f22", K_F22},
		{"f23", K_F23},
		{"f24", K_F24},
		{"capslock", K_CAPSLOCK},
		{"command", K_META},
		{"alt", K_ALT},
		{"right_alt", K_RIGHT_ALT},
		{"control", K_CONTROL},
		{"left_control", K_LEFT_CONTROL},
		{"right_control", K_RIGHT_CONTROL},
		{"shift", K_SHIFT},
		{"right_shift", K_RIGHTSHIFT},
		{"space", K_SPACE},
		{"printscreen", K_PRINTSCREEN},
		{"insert", K_INSERT},
		{"menu", K_MENU},

		{"audio_mute", K_AUDIO_VOLUME_MUTE},
		{"audio_vol_down", K_AUDIO_VOLUME_DOWN},
		{"audio_vol_up", K_AUDIO_VOLUME_UP},
		{"audio_play", K_AUDIO_PLAY},
		{"audio_stop", K_AUDIO_STOP},
		{"audio_pause", K_AUDIO_PAUSE},
		{"audio_prev", K_AUDIO_PREV},
		{"audio_next", K_AUDIO_NEXT},
		{"audio_rewind", K_AUDIO_REWIND},
		{"audio_forward", K_AUDIO_FORWARD},
		{"audio_repeat", K_AUDIO_REPEAT},
		{"audio_random", K_AUDIO_RANDOM},

		{"numpad_lock", K_NUMPAD_LOCK},
		{"numpad_0", K_NUMPAD_0},
		{"numpad_0", K_NUMPAD_0},
		{"numpad_1", K_NUMPAD_1},
		{"numpad_2", K_NUMPAD_2},
		{"numpad_3", K_NUMPAD_3},
		{"numpad_4", K_NUMPAD_4},
		{"numpad_5", K_NUMPAD_5},
		{"numpad_6", K_NUMPAD_6},
		{"numpad_7", K_NUMPAD_7},
		{"numpad_8", K_NUMPAD_8},
		{"numpad_9", K_NUMPAD_9},
		{"numpad_+", K_NUMPAD_PLUS},
		{"numpad_-", K_NUMPAD_MINUS},
		{"numpad_*", K_NUMPAD_MULTIPLY},
		{"numpad_/", K_NUMPAD_DIVIDE},
		{"numpad_.", K_NUMPAD_DECIMAL},

		{"lights_mon_up", K_LIGHTS_MON_UP},
		{"lights_mon_down", K_LIGHTS_MON_DOWN},
		{"lights_kbd_toggle", K_LIGHTS_KBD_TOGGLE},
		{"lights_kbd_up", K_LIGHTS_KBD_UP},
		{"lights_kbd_down", K_LIGHTS_KBD_DOWN},

		{NULL, K_NOT_A_KEY} /* end marker */
};

int CheckKeyCodes(const char *k, MMKeyCode *key)
{
	if (!key)
		return -1;

	if (strlen(k) == 1)
	{
		*key = keyCodeForChar(*k);
		return 0;
	}

	*key = K_NOT_A_KEY;

	KeyNames *kn = key_names;
	while (kn->name)
	{
		if (strcmp(k, kn->name) == 0)
		{
			*key = kn->key;
			break;
		}
		kn++;
	}

	if (*key == K_NOT_A_KEY)
	{
		return -2;
	}

	return 0;
}

int CheckKeyFlags(const char *f, MMKeyFlags *flags)
{
	if (!flags)
		return -1;

	if (strcmp(f, "alt") == 0 || strcmp(f, "right_alt") == 0)
	{
		*flags = MOD_ALT;
	}
	else if (strcmp(f, "command") == 0)
	{
		*flags = MOD_META;
	}
	else if (strcmp(f, "control") == 0 || strcmp(f, "right_control") == 0 || strcmp(f, "left_control") == 0)
	{
		*flags = MOD_CONTROL;
	}
	else if (strcmp(f, "shift") == 0 || strcmp(f, "right_shift") == 0)
	{
		*flags = MOD_SHIFT;
	}
	else if (strcmp(f, "none") == 0)
	{
		*flags = MOD_NONE;
	}
	else
	{
		return -2;
	}

	return 0;
}

MMKeyCode getKeyCodeFromArg(Napi::CallbackInfo &info, int index)
{
	Napi::Env env = info.Env();
	MMKeyCode key = -1;
	if (info.Length() >= index + 1)
	{
		Napi::Value arg = info[index];
		if (!arg.IsString())
		{
			Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
		}
		Napi::String keyStr = arg.As<Napi::String>();
		int check = CheckKeyCodes(keyStr.Utf8Value().c_str(), &key);
		if (check == -1)
		{
			Napi::TypeError::New(env, "Null pointer in key code.").ThrowAsJavaScriptException();
		}
		if (check == -2)
		{
			Napi::TypeError::New(env, "Invalid key code specified.").ThrowAsJavaScriptException();
		}
	}
	return key;
}

MMKeyFlags getKeyModifiedByArg(Napi::CallbackInfo &info, int index)
{
	Napi::Env env = info.Env();
	MMKeyFlags flags = MOD_NONE;
	std::list<std::string> modify_strs;
	if (info.Length() >= index + 1)
	{
		Napi::Value arg = info[index];
		if (!arg.IsString() && !arg.IsArray())
		{
			return flags;
		}
		if (arg.IsString())
		{
			modify_strs.push_back(arg.As<Napi::String>().Utf8Value());
		}
		else
		{
			Napi::Array arr = arg.As<Napi::Array>();
			for (uint32_t i = 0; i < arr.Length(); i++)
			{
				Napi::Value v = arr[i];
				if (!v.IsString())
				{
					Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
				}
				modify_strs.push_back(v.As<Napi::String>().Utf8Value());
			}
		}
		for (std::list<std::string>::iterator it = modify_strs.begin(); it != modify_strs.end(); it++)
		{
			int check_res = CheckKeyFlags((*it).c_str(), &flags);
			if (check_res == -1)
			{
				Napi::TypeError::New(env, "Null pointer in key code.").ThrowAsJavaScriptException();
			}
			if (check_res == -2)
			{
				Napi::TypeError::New(env, "Invalid key code specified.").ThrowAsJavaScriptException();
			}
			flags = flags | check_res;
		}
	}
	return flags;
}

ScreenPos GetPosByArg(const Napi::CallbackInfo &info)
{
	ScreenPos pos_info;
	Napi::Env env = info.Env();
	if (info.Length() < 2)
	{
		Napi::TypeError::New(env, "arg number need 2").ThrowAsJavaScriptException();
	}
	if (!info[0].IsNumber() || !info[1].IsNumber())
	{
		Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
	}
	Napi::Number x = info[0].As<Napi::Number>();
	Napi::Number y = info[1].As<Napi::Number>();
	pos_info.x = x.Int32Value();
	pos_info.y = y.Int32Value();
	return pos_info;
}

void GetStrByArg(Napi::CallbackInfo &info, int index, char *str)
{
	Napi::Env env = info.Env();
	if (info.Length() >= index + 1)
	{
		if (!info[index].IsString())
		{
			Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
		}
		strcpy(str, info[index].As<Napi::String>().Utf8Value().c_str());
	}
}

void CheckCallback(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (info.Length() > 1 && info[info.Length() - 1].IsFunction())
	{
		Napi::Function cb = info[info.Length() - 1].As<Napi::Function>();
		cb.Call(env.Global(), {});
	}
}

// mouse
void node_dragMouse(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	ScreenPos pos = GetPosByArg(info);
	MMMouseButton button = LEFT_BUTTON;
	MMSignedPoint point;
	point = MMSignedPointMake(pos.x, pos.y);
	dragMouse(point, button);
	microsleep(mouseDelay);
}

void node_updateScreenMetrics(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	updateScreenMetrics();
}

void node_moveMouse(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMSignedPoint point;
	ScreenPos pos = GetPosByArg(info);
	point = MMSignedPointMake(pos.x, pos.y);
	moveMouse(point);
	microsleep(mouseDelay);
}

void node_moveMouseSmooth(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	double speed = 3.0;
	ScreenPos pos = GetPosByArg(info);
	MMPoint point;
	if (info.Length() >= 3 && info[2].IsNumber())
	{
		speed = info[2].As<Napi::Number>().DoubleValue();
	}
	point = MMPointMake(pos.x, pos.y);
	smoothlyMoveMouse(point, speed);
	microsleep(mouseDelay);
}

Napi::Object node_getMousePos(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMPoint pos = getMousePos();
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("x", Napi::Number::New(env, pos.x));
	obj.Set("y", Napi::Number::New(env, pos.y));
	return obj;
}

void node_mouseClick(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMMouseButton button = getMouseButton(info, 0);
	bool doubleC = false;
	if (info.Length() >= 2)
	{
		if (!info[1].IsBoolean())
		{
			Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
		}
		Napi::Boolean arg2 = info[1].As<Napi::Boolean>();
		doubleC = arg2.Value();
	}
	if (doubleC)
		doubleClick(button);
	else
		clickMouse(button);
	microsleep(mouseDelay);
}

void node_mouseToggle(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMMouseButton button = getMouseButton(info, 1);
	bool down = false;
	if (info.Length() >= 1)
	{
		if (!info[0].IsBoolean())
		{
			Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
		}
		down = info[0].As<Napi::Boolean>().Value();
	}
	toggleMouse(down, button);
	microsleep(mouseDelay);
}

void node_setMouseDelay(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (info.Length() != 1 || !info[0].IsNumber())
	{
		Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
	}
	mouseDelay = info[0].As<Napi::Number>().Int32Value();
}

// keyboard
void node_keytap(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMKeyCode key = getKeyCodeFromArg(info, 0);
	MMKeyFlags flags = getKeyModifiedByArg(info, 1);
	toggleKeyCode(key, true, flags);
	microsleep(keyboardDelay);
	toggleKeyCode(key, false, flags);
	microsleep(keyboardDelay);
	CheckCallback(info);
}

void node_keyToggle(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	MMKeyCode key = getKeyCodeFromArg(info, 0);
	MMKeyFlags flags = getKeyModifiedByArg(info, 2);
	bool down = false;
	char down_arg[100] = "";
	GetStrByArg(info, 1, down_arg);
	if (strcmp(down_arg, "down"))
	{
		down = true;
	}
	toggleKeyCode(key, down, flags);
	microsleep(keyboardDelay);
	CheckCallback(info);
}

void node_typeString(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	char str[1000] = "";
	GetStrByArg(info, 0, str);
	typeStringDelayed(str, 0);
	CheckCallback(info);
}

void node_SetKeyboardDelay(Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (info.Length() != 1 || !info[0].IsNumber())
	{
		Napi::TypeError::New(env, "args error").ThrowAsJavaScriptException();
	}
	keyboardDelay = info[0].As<Napi::Number>().Int32Value();
}

void padHex(MMRGBHex color, char *hex)
{
	// Length needs to be 7 because snprintf includes a terminating null.
	// Use %06x to pad hex value with leading 0s.
	snprintf(hex, 7, "%06x", color);
}

Napi::Object node_getScreenSize(Napi::CallbackInfo &info)
{
	MMSize displaySize = getMainDisplaySize();
	Napi::Env env = info.Env();
	Napi::Object obj = Napi::Object::New(env);
	obj.Set("width", Napi::Number::New(env, displaySize.width));
	obj.Set("height", Napi::Number::New(env, displaySize.height));
	return obj;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
	exports.Set(Napi::String::New(env, "dragMouse"), Napi::Function::New(env, node_dragMouse));
	exports.Set(Napi::String::New(env, "updateScreenMetrics"), Napi::Function::New(env, node_updateScreenMetrics));
	exports.Set(Napi::String::New(env, "moveMouse"), Napi::Function::New(env, node_moveMouse));
	exports.Set(Napi::String::New(env, "moveMouseSmooth"), Napi::Function::New(env, node_moveMouseSmooth));
	exports.Set(Napi::String::New(env, "getMousePos"), Napi::Function::New(env, node_getMousePos));
	exports.Set(Napi::String::New(env, "mouseClick"), Napi::Function::New(env, node_mouseClick));
	exports.Set(Napi::String::New(env, "mouseToggle"), Napi::Function::New(env, node_mouseToggle));
	exports.Set(Napi::String::New(env, "setMouseDelay"), Napi::Function::New(env, node_setMouseDelay));
	exports.Set(Napi::String::New(env, "keyTap"), Napi::Function::New(env, node_keytap));
	exports.Set(Napi::String::New(env, "keyToggle"), Napi::Function::New(env, node_keyToggle));
	exports.Set(Napi::String::New(env, "typeString"), Napi::Function::New(env, node_typeString));
	exports.Set(Napi::String::New(env, "setKeyboardDelay"), Napi::Function::New(env, node_SetKeyboardDelay));
	exports.Set(Napi::String::New(env, "getScreenSize"), Napi::Function::New(env, node_getScreenSize));
	return exports;
}
NODE_API_MODULE(robotjs, InitAll)
