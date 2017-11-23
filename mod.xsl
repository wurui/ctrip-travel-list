<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">
    <xsl:template match="/root" name="wurui.ctrip-travel-list">
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-ctrip-travel-list" ox-mod="ctrip-travel-list">
            <ul ox-refresh="append">
            	<xsl:for-each select="data/lbs-products/i[position() &lt;= 10]">
            		<li>
            			<a href="{href}">
	            			<img class="mainpic"
	            			 style="background-image:url({img}@!w240)"
	            			 src="https://a.oxm1.cc/img/blank.png"/>
		            		<h4 class="title"><xsl:value-of select="title"/></h4>
		            		
		            		<p class="score" data-score="{score}">
		            			<xsl:value-of select="comment_count"/>条点评
		            		</p>
		            		<p class="tags">
		            			<del>
		            				<xsl:value-of select="orig_price"/>
		            			</del>
		            			<xsl:copy-of select="tags/i"/>
		            		</p>
		            		<p class="spot">
		            			<span class="price">
		            				<em><xsl:value-of select="price"/></em>
		            			</span>
		            			<span class="location"><xsl:value-of select="location"/></span>
		            			
		            		</p>
		            		<p class="bottom">
		            			<xsl:value-of select="brief"/>
		            		</p>
		            	</a>
            		</li>
            	</xsl:for-each>
            </ul>
        </div>
    </xsl:template>
</xsl:stylesheet>
