import sys

html_path = sys.argv[1]

try:
    with open(html_path, "r", errors="ignore") as file:
        data = file.read()
    
    data = data.replace("""
        body {
            font-family: arial;
            margin: 0;
            padding: none;
            background-color:powderblue;
        }""", """
        body {
            font-family: arial;
            margin: 0;
            padding: none;
            background-color:rgb(20, 22, 30);
        }""")

    data = data.replace("""
        #progress {
            height: 20px;
            width: 300px;
        }""", """
        #progress {
            height: 50px;
            width: 300px;
        }""")

    data = data.replace("""def pg_bar(pos):
        nonlocal marginx, marginy
        # resolution of progress bar, recalculate since it may not be know yet.
        total = track.len or 10  # avoid div0
        slot = ux(.060)/ total # 60%

        pygame.draw.rect(screen,(10,10,10),( marginx-ux(10), marginy-uy(10), (total*slot)+ux(20), uy(110) ) )
        pygame.draw.rect(screen,(0,255,0), ( marginx, marginy, track.pos*slot, uy(90)) )""", """def pg_bar(pos, return_size=False):
        nonlocal marginx, marginy
        # resolution of progress bar, recalculate since it may not be know yet.
        total = track.len or 10  # avoid div0
        slot = ux(.060)/ total # 60%
        rect = ( marginx, marginy, track.pos*slot, uy(90))
        border_rect = tuple(rect[r]+b for r,b in enumerate((-ux(10), -uy(10), ux(20), uy(20))))
        pygame.draw.rect(screen, (255, 251, 0), border_rect, border_radius=10)
        pygame.draw.rect(screen, (199, 96, 0), rect, border_radius=10)
        return rect[2:] if return_size else None""")

    data = data.replace("""prompt = fnt.render("Ready to start !", True, "blue")
        pg_bar(track.len)
        screen.blit(prompt, ( marginx+ ux(80), marginy - uy(10) ) )""", """prompt = fnt.render("~ Click Anywhere to Start ~", True, (255, 251, 0))
        rect = pg_bar(track.len, True)
        screen.blit(prompt, ( marginx + (rect[0] - prompt.get_rect()[2]) * .5, marginy + (rect[1] - prompt.get_rect()[3]) * .5) )""")

    data = data.replace("""pg_bar(track.len)
        screen.blit(prompt, ( marginx+ ux(80), marginy - uy(10) ) )""", """rect = pg_bar(track.len)
        screen.blit(prompt, ( marginx + (rect[0] - prompt.get_rect()[2]) * .5, marginy + (rect[1] - prompt.get_rect()[3]) * .5) )""")

    data = data.replace("""platform.document.body.style.background = \"#7f7f7f\"""", """platform.document.body.style.background = \"rgb(20, 22, 30)\"""")
    with open(html_path, "w") as file:
        file.write(data)

except Exception as err:
    args = '\n'.join(map(str, err.args))
    print(f"{err}\n{args}")