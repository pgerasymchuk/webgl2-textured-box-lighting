precision highp float;

uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;
uniform sampler2D uTexture;

varying highp vec3 vNormal;
varying highp vec2 vTexCoord;
varying highp vec3 vPosition;

void main() {
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightPos - vPosition);
    vec3 viewDir = normalize(uViewPos - vPosition);
    vec3 reflectDir = reflect(-lightDir, norm);

    vec4 texColor = texture2D(uTexture, vTexCoord);

    float ambientStrength = 0.8;
    vec3 ambient = ambientStrength * uAmbientColor * texColor.rgb;

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uDiffuseColor * texColor.rgb;

    float specularStrength = 0.5;
    float shininess = 32.0;
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularStrength * spec * uSpecularColor;

    vec3 result = ambient + diffuse + specular;
    gl_FragColor = vec4(result, 1.0);
}
