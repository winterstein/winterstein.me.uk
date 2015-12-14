TEXTFILES = careers.txt contact.txt index.txt payment.txt products.txt story.txt testimonials.txt

all: $(TEXTFILES) header.txt
	for i in $(TEXTFILES); do cat header.txt $$i | pandoc > `basename $$i .txt`.html; done

clean:
	rm *.html
